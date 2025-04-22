import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  create(userId: number, dto: CreateAddressDto) {
    const address = this.addressRepo.create({ ...dto, userId });
    return this.addressRepo.save(address);
  }

  findAll(userId: number) {
    return this.addressRepo.find({ where: { userId } });
  }

  async update(userId: number, id: number, dto: UpdateAddressDto) {
    const address = await this.addressRepo.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');
    return this.addressRepo.save({ ...address, ...dto });
  }

  async delete(userId: number, id: number) {
    const address = await this.addressRepo.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');
    return this.addressRepo.remove(address);
  }
}
