import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cart-item.entity';

import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductsModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
