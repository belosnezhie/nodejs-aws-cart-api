import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { Order, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services/cart.service';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';
import { Orders as OrderEntity } from '../db/order.entity';
import { CartItem as CartItemEntity } from 'src/db/cart.item.entity';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/profile/cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  @Inject(CartService)
  private cartService: CartService;

  @Inject(OrderService)
  private orderService: OrderService;

  @Inject(DataSource)
  private dataSource: DataSource;

  // constructor(
  // private cartService: Cart1Service,
  // private orderService: OrderService,
  // private readonly dataSource: DataSource,
  // ) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CartItemEntity[]> {
    this.logger.log('findUserCart');
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() body: PutCartPayload,
  ): Promise<CartItemEntity[]> {
    // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);

    const result = await this.dataSource.transaction(async (manager) => {
      this.logger.log('checkout', body);

      const cart = await this.cartService.findByUserId(userId, manager);

      this.logger.log('cart', cart);

      if (!(cart && cart.items.length)) {
        throw new BadRequestException('Cart is empty');
      }

      const { id: cartId, items } = cart;
      // const total = calculateCartTotal(items);
      const order: OrderEntity = await this.orderService.create(
        {
          userId,
          cartId,
          items: items.map(({ product_id, count }) => ({
            productId: product_id,
            count,
          })),
          address: body.address,
          total: 0,
        },
        manager,
      );

      this.logger.log('order', order);
      // update Cart status
      await this.cartService.updateCartStatus(userId, manager);

      this.logger.log('cart updated', cart);

      return order;
    });

    return {
      result,
    };
  }

  // @UseGuards(BasicAuthGuard)
  @Get('order')
  async getOrder(): Promise<OrderEntity[]> {
    return await this.orderService.getAll();
  }
}
