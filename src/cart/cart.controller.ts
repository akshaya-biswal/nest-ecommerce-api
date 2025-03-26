/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addItem(@Req() req, @Body() body: { productId: number; quantity: number }) {
    return this.cartService.addItem(
      req.user.userId,
      body.productId,
      body.quantity,
    );
  }

  @Put()
  updateItem(
    @Req() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.updateItem(
      req.user.userId,
      body.productId,
      body.quantity,
    );
  }

  @Delete(':productId')
  removeItem(@Req() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, +productId);
  }
}
