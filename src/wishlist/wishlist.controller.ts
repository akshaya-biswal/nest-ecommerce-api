/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getAll(@Req() req) {
    return this.wishlistService.findAll(req.user.userId);
  }

  @Post(':productId')
  add(@Req() req, @Param('productId') productId: string) {
    return this.wishlistService.add(req.user.userId, +productId);
  }

  @Delete(':productId')
  remove(@Req() req, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.userId, +productId);
  }
}
