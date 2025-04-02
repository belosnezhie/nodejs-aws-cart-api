import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { Cart1Controller } from './cart1.controller';
import { Cart1Service } from './services/cart1.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/db/cart.entity';
import { CartItem } from 'src/db/cart.item.entity';

@Module({
  imports: [OrderModule, TypeOrmModule.forFeature([Cart, CartItem])],
  providers: [CartService, Cart1Service],
  controllers: [CartController, Cart1Controller],
})
export class CartModule {}
