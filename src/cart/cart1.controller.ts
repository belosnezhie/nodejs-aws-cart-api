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
import { Cart1Service } from './services/cart1.service';
import { CartItem } from './models';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';
import { Cart as CartEntity } from '../db/cart.entity';
import { CartItem as CartItemEntity } from 'src/db/cart.item.entity';
import { console } from 'inspector';
import { Logger, Injectable } from '@nestjs/common';

@Controller('api/profile/cart1')
export class Cart1Controller {
  private readonly logger = new Logger(Cart1Controller.name);

  @Inject(Cart1Service)
  private cartService: Cart1Service;

  // constructor(
  //   private cartService: Cart1Service,
  //   private orderService: OrderService,
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

    // this.logger.log('findUserCart');
    // return 'ok';
  }

  // // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  // @Put()
  // updateUserCart(
  //   @Req() req: AppRequest,
  //   @Body() body: PutCartPayload,
  // ): CartItem[] {
  //   // TODO: validate body payload...
  //   const cart = this.cartService.updateByUserId(
  //     getUserIdFromRequest(req),
  //     body,
  //   );

  //   return cart.items;
  // }

  // // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  // @Delete()
  // @HttpCode(HttpStatus.OK)
  // clearUserCart(@Req() req: AppRequest) {
  //   this.cartService.removeByUserId(getUserIdFromRequest(req));
  // }

  // // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  // @Put('order')
  // checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
  //   const userId = getUserIdFromRequest(req);
  //   const cart = this.cartService.findByUserId(userId);

  //   if (!(cart && cart.items.length)) {
  //     throw new BadRequestException('Cart is empty');
  //   }

  //   const { id: cartId, items } = cart;
  //   const total = calculateCartTotal(items);
  //   const order = this.orderService.create({
  //     userId,
  //     cartId,
  //     items: items.map(({ product, count }) => ({
  //       productId: product.id,
  //       count,
  //     })),
  //     address: body.address,
  //     total,
  //   });
  //   this.cartService.removeByUserId(userId);

  //   return {
  //     order,
  //   };
  // }

  // @UseGuards(BasicAuthGuard)
  // @Get('order')
  // getOrder(): Order[] {
  //   return this.orderService.getAll();
  // }
}
