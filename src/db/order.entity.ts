import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Address, OrderStatus } from '../order/type';

@Entity('orders')
export class Orders {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('jsonb')
  items: Array<{ productId: string; count: number }>;

  @Column('uuid')
  cart_id: string;

  @Column('jsonb')
  delivery: Address;

  @Column('text')
  comments: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Open,
  })
  status: OrderStatus;

  @Column('integer')
  total: number;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart?: Cart;
}
