import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders as OrderEntity } from '../db/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
