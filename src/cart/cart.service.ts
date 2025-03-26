import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      cart = await this.cartRepo.save(cart);
    }
    return cart;
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addItem(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productsService.findOne(productId);

    const existingItem = cart.items.find(
      (item) => item.product.id === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      await this.itemRepo.save(existingItem);
    } else {
      const item = this.itemRepo.create({ cart, product, quantity });
      await this.itemRepo.save(item);
    }

    return this.getCart(userId);
  }

  async updateItem(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((item) => item.product.id === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    item.quantity = quantity;
    await this.itemRepo.save(item);
    return this.getCart(userId);
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((item) => item.product.id === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    await this.itemRepo.delete(item.id);
    return this.getCart(userId);
  }
}
