import { Category } from 'src/categories/category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}

// QA
// what is text ? although string is already defined
// what is  { precision: 10, scale: 2 } and what it does
// why we explicitly define @Column() categoryId: number in the Product entity, even though we already have the @ManyToOne(() => Category) relationship.
