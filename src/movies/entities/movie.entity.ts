import { Rental } from 'src/rentals/entities/rental.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  posterLink: string;

  @Column()
  stock: number;

  @Column()
  trailerLink: string;

  @Column()
  rentPrice: number;

  @Column()
  salePrice: number;

  @Column()
  likes: number;

  @Column()
  availability: boolean;

  @OneToMany(() => Sale, (sale) => sale.movie)
  sales: Sale[];

  @OneToMany(() => Rental, (rental) => rental.movie)
  rentals: Rental[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
