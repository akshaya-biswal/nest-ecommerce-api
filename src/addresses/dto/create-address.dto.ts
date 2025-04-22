import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString() fullName: string;
  @IsString() phone: string;
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() zipCode: string;
  @IsString() country: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}
