import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './coupon.entity';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepo: Repository<Coupon>,
  ) {}

  async create(dto: CreateCouponDto) {
    const existing = await this.couponRepo.findOne({
      where: { code: dto.code },
    });
    if (existing) throw new ConflictException('Coupon code already exists');

    const coupon = this.couponRepo.create(dto);
    return this.couponRepo.save(coupon);
  }

  findAll() {
    return this.couponRepo.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.couponRepo.findOne({
      where: { code, isActive: true },
    });
    if (!coupon || coupon.expirationDate < new Date()) {
      throw new NotFoundException('Coupon is invalid or expired');
    }
    return coupon;
  }

  async update(id: number, dto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, dto);
    return this.couponRepo.save(coupon);
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    return this.couponRepo.remove(coupon);
  }
}
