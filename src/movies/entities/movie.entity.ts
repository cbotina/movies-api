import { Sale } from 'src/sales/entities/sale.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
}
