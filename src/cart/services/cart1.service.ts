import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Cart } from '../models';
import { PutCartPayload } from 'src/order/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart as CartEntity, CartStatuses } from '../../db/cart.entity';
import { CartItem as CartItemEntity } from 'src/db/cart.item.entity';

@Injectable()
export class Cart1Service {
  private userCarts: Record<string, Cart> = {};
  private readonly logger = new Logger(Cart1Service.name);

  @InjectRepository(CartEntity)
  private cartRepo: Repository<CartEntity>;
  @InjectRepository(CartItemEntity)
  private cartItemRepo: Repository<CartItemEntity>;

  async findByUserId(userId: string): Promise<CartEntity> {
    return await this.cartRepo.findOne({
      where: { user_id: userId },
      relations: { items: true },
    });
  }

  createByUserId(user_id: string): CartEntity {
    const date = new Date();

    const cart: CartEntity = {
      id: randomUUID(),
      user_id,
      created_at: date,
      updated_at: date,
      status: CartStatuses.OPEN,
      items: [],
    };

    this.cartRepo.create(cart);

    return cart;
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    this.logger.log('findOrCreateByUserId');

    if (userCart) {
      this.logger.log(`userCart:${userCart}`);
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<CartEntity> {
    const userCart = await this.findOrCreateByUserId(userId);

    const index = userCart.items.findIndex(
      ({ product_id }) => product_id === payload.product.id,
    );

    if (index === -1) {
      const cartItem = this.cartItemRepo.create({
        product_id: payload.product.id,
        count: payload.count,
        cart: userCart,
      });
      this.logger.log('updateByUserId, create product' + payload.product.id);
      userCart.items.push(cartItem);
    } else if (payload.count === 0) {
      await this.cartItemRepo.delete({
        cart: { id: userCart.id },
        product_id: payload.product.id,
      });
      this.logger.log('updateByUserId, delete product' + payload.product.id);
      userCart.items.splice(index, 1);
    } else {
      userCart.items[index].count = payload.count;
      await this.cartItemRepo.save(userCart.items[index]);
    }

    return userCart;
  }

  async removeByUserId(userId: string): Promise<void> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      await this.cartRepo.delete(userCart.id);
    }

    this.userCarts[userId] = null;
  }
}
