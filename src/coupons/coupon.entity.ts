import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column('decimal', { precision: 5, scale: 2 }) // e.g., 15.00 = 15%
  discount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp' })
  expirationDate: Date;
}
