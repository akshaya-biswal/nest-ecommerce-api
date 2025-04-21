import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepo: Repository<Wishlist>,
    private productsService: ProductsService,
  ) {}

  async add(userId: number, productId: number) {
    const existing = await this.wishlistRepo.findOne({
      where: { userId, product: { id: productId } },
    });

    if (existing) throw new ConflictException('Product already in wishlist');

    const product = await this.productsService.findOne(productId);
    const wishlistItem = this.wishlistRepo.create({ userId, product });
    return this.wishlistRepo.save(wishlistItem);
  }

  findAll(userId: number) {
    return this.wishlistRepo.find({ where: { userId } });
  }

  async remove(userId: number, productId: number) {
    const item = await this.wishlistRepo.findOne({
      where: { userId, product: { id: productId } },
    });
    if (!item) throw new NotFoundException('Item not in wishlist');
    return this.wishlistRepo.remove(item);
  }
}
