import { Movie } from '../../../src/movies/entities/movie.entity';
import { User } from '../../../src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.sales, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.sales)
  movie: Movie;

  @Column()
  quantity: number;

  @Column({ type: 'date' })
  datePurchased: Date;
}
