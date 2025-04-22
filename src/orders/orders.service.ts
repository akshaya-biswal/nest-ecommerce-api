import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// import { OrderItem } from './order-item.entity';
// import { Order, OrderStatus } from './order.entity';
import { CartService } from '../cart/cart.service';

import { Order, OrderStatus } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { CouponsService } from 'src/coupons/coupons.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly couponsService: CouponsService,
  ) {}

  async placeOrder(userId: number, couponCode?: string): Promise<Order> {
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

    let total = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    // 💸 Handle coupon
    let discountAmount = 0;
    let appliedCoupon: string | undefined = undefined;

    if (couponCode) {
      const coupon = await this.couponsService.findByCode(couponCode);
      discountAmount = (Number(coupon.discount) / 100) * total;
      total = total - discountAmount;
      appliedCoupon = coupon.code;
    }

    const order = this.orderRepo.create({
      userId,
      items,
      total,
      discountAmount,
      couponCode: appliedCoupon,
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

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    // Validate status change flow
    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.PAID
    ) {
      throw new BadRequestException(
        'Cannot update a completed or cancelled order',
      );
    }

    order.status = status;
    return this.orderRepo.save(order);
  }

  async payForOrder(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Access denied');
    if (order.status === OrderStatus.PAID)
      throw new BadRequestException('Order already paid');
    if (order.status === OrderStatus.CANCELLED)
      throw new BadRequestException('Cannot pay a cancelled order');

    // Simulate successful payment
    order.status = OrderStatus.PAID;
    return this.orderRepo.save(order);
  }

  async getPaginatedOrders(page: number = 1, limit: number = 10) {
    const [orders, total] = await this.orderRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: orders,
      meta: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }
}
