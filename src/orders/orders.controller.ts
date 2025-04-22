/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Controller,
  Query,
} from '@nestjs/common';

import { Roles } from '../auth/roles.decorator';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  placeOrder(@Req() req, @Body('couponCode') couponCode?: string) {
    return this.ordersService.placeOrder(req.user.userId, couponCode);
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

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(+id, body.status);
  }

  @Patch(':id/pay')
  payForOrder(@Req() req, @Param('id') id: string) {
    return this.ordersService.payForOrder(req.user.userId, +id);
  }

  @Get()
  async getPaginatedOrders(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    return this.ordersService.getPaginatedOrders(pageNumber, limitNumber);
  }
}
