import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.findOne(id); // Ensure exists
    await this.productRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Ensure exists
    await this.productRepo.delete(id);
  }

  async getByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepo.find({
      where: { categoryId },
    });
  }
}

// QA
// Is find is going to take any arguments ?
// Difference between findOne(id) and findOne({ where: { id } })
