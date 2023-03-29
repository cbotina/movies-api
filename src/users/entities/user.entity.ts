import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer/';

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
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.CLIENT,
  })
  role: Roles;
}
