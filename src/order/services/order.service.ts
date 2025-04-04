import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Order } from '../models';
import { CreateOrderPayload, OrderStatus } from '../type';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders as OrderEntity } from '../../db/order.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class OrderService {
  private orders: Record<string, OrderEntity> = {};
  private readonly logger = new Logger(OrderService.name);

  @InjectRepository(OrderEntity)
  private orderRepo: Repository<OrderEntity>;

  async getAll() {
    return await this.orderRepo.find();
  }

  async findById(orderId: string): Promise<OrderEntity> {
    return await this.orderRepo.findOne({
      where: { user_id: orderId },
      relations: { items: true },
    });
  }

  async create(
    data: CreateOrderPayload,
    manager: EntityManager,
  ): Promise<OrderEntity> {
    const id = randomUUID() as string;

    const repo = manager ? manager.getRepository(OrderEntity) : this.orderRepo;

    const orderData: OrderEntity = {
      id,
      user_id: data.userId,
      items: data.items,
      cart_id: data.cartId,
      delivery: data.address,
      comments: '',
      status: OrderStatus.Open,
      total: data.total,
    };

    const createdOrder = await repo.save(orderData);

    this.logger.log('Order was created:' + createdOrder.id);

    this.orders[id] = createdOrder;

    return createdOrder;
  }

  // TODO add  type
  update(orderId: string, data: Order) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }
  }
}
