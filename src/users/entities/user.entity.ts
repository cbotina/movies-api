import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer/';
import { Sale } from 'src/sales/entities/sale.entity';
import { Rental } from 'src/rentals/entities/rental.entity';

export enum Roles {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity('user_table')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password?: string;

  @Column({ default: 0 })
  balance?: number;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[];

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.CLIENT,
  })
  role: Roles;
}
