import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderItem } from './order-item.entity';
import { Order, OrderStatus } from './order.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    private readonly cartService: CartService,
  ) {}

  async placeOrder(userId: number): Promise<Order> {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) throw new NotFoundException('Cart is empty');

    const items = cart.items.map((item) => {
      const orderItem = this.itemRepo.create({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      });
      return orderItem;
    });

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    const order = this.orderRepo.create({
      userId,
      items,
      total,
      status: OrderStatus.PENDING,
    });

    await this.cartService.clearCart(userId); // Optional: clear cart after order

    return this.orderRepo.save(order);
  }

  async getUserOrders(userId: number) {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders() {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }
}
