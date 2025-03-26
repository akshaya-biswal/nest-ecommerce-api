/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';

import { Roles } from '../auth/roles.decorator';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  placeOrder(@Req() req) {
    return this.ordersService.placeOrder(req.user.userId);
  }

  @Get()
  getMyOrders(@Req() req) {
    return this.ordersService.getUserOrders(req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('all')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }
}
