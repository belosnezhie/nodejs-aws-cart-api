import { Entity, ManyToOne, PrimaryColumn, Column, JoinColumn } from 'typeorm';
import { Cart } from './cart';

@Entity()
export class CartItem {
  @PrimaryColumn('uuid')
  cart_id: string;

  @Column('uuid')
  product_id: string;

  @Column('integer')
  count: number;

  @ManyToOne(() => Cart, (cart: Cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
