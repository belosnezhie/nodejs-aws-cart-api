import { CartItem } from '../models';
// import { Cart as CartEntity } from '../../db/cart.entity';
// import { CartItem as CartItemEntity } from '../../db/cart.item.entity';

export function calculateCartTotal(items: CartItem[]): number {
  return items.length
    ? items.reduce((acc: number, { product: { price }, count }: CartItem) => {
        return (acc += price * count);
      }, 0)
    : 0;
}
