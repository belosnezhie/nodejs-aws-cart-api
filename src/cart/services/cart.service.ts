import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Cart } from '../models';
import { PutCartPayload } from 'src/order/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart as CartEntity, CartStatuses } from '../../db/cart.entity';
import { CartItem as CartItemEntity } from 'src/db/cart.item.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};
  private readonly logger = new Logger(CartService.name);

  @InjectRepository(CartEntity)
  private cartRepo: Repository<CartEntity>;
  @InjectRepository(CartItemEntity)
  private cartItemRepo: Repository<CartItemEntity>;

  async findByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<CartEntity> {
    const repo = manager ? manager.getRepository(CartEntity) : this.cartRepo;

    this.logger.log('findByUserId from cart.service');
    const cart = await repo.findOne({
      where: { user_id: userId },
      relations: { items: true },
    });

    this.logger.log(
      'Cart founded in findByUserId from cart.service',
      JSON.stringify(cart),
    );

    return cart;
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
      this.logger.log(`userCart:${JSON.stringify(userCart)}`);
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<CartEntity> {
    const userCart = await this.findOrCreateByUserId(userId);

    this.logger.log('payload.id from updateByUserId' + payload.product.id);

    const index = userCart.items.findIndex(
      ({ product_id }) => product_id === payload.product.id,
    );

    this.logger.log('index from updateByUserId' + index);

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

  async updateCartStatus(
    userID: string,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager ? manager.getRepository(CartEntity) : this.cartRepo;

    const cart = await this.findByUserId(userID);

    if (cart) {
      cart.status = CartStatuses.ORDERED;
      await repo.save(cart);
    }
  }

  async removeByUserId(userId: string): Promise<void> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      await this.cartRepo.delete(userCart.id);
    }

    this.userCarts[userId] = null;
  }
}
