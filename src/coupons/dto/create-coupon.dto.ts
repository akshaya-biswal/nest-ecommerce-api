import { IsString, IsNumber, Min, Max, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @IsString() code: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  discount: number; // % discount

  @IsDateString()
  expirationDate: string;
}
