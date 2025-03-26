import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartItem } from './cart-item.entity';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductsModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
