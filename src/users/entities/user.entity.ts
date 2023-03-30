import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer/';
import { Sale } from 'src/sales/entities/sale.entity';

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

  @Column()
  balance: number;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.CLIENT,
  })
  role: Roles;
}
