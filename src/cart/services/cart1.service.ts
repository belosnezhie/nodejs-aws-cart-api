import { Injectable } from '@nestjs/common';
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

  @InjectRepository(CartEntity)
  private cartRepo: Repository<CartEntity>;

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

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  // updateByUserId(userId: string, payload: PutCartPayload): Cart {
  //   const userCart = this.findOrCreateByUserId(userId);

  //   const index = userCart.items.findIndex(
  //     ({ product }) => product.id === payload.product.id,
  //   );

  //   if (index === -1) {
  //     userCart.items.push(payload);
  //   } else if (payload.count === 0) {
  //     userCart.items.splice(index, 1);
  //   } else {
  //     userCart.items[index] = payload;
  //   }

  //   return userCart;
  // }

  // removeByUserId(userId): void {
  //   this.userCarts[userId] = null;
  // }
}
