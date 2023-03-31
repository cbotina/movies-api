import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum RentalStatus {
  ACTIVE = 'active',
  RETURNED = 'returned',
}

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rentals, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.rentals)
  movie: Movie;

  @Column({ type: 'date' })
  rentalDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', default: null })
  returnDate?: Date;

  @Column({ type: 'enum', enum: RentalStatus, default: RentalStatus.ACTIVE })
  status: RentalStatus;
}
