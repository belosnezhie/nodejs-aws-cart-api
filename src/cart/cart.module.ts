import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

// import { CartController } from './cart.controller';
// import { CartService } from './services';
import { CartController } from './cart.controller';
import { CartService } from './services/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/db/cart.entity';
import { CartItem } from 'src/db/cart.item.entity';

@Module({
  imports: [OrderModule, TypeOrmModule.forFeature([Cart, CartItem])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
