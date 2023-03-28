import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum Roles {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity('user_table')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.CLIENT,
  })
  role: string;
}
