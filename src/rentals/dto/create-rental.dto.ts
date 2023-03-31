import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { RentalStatus } from '../entities/rental.entity';

export class CreateRentalDto {
  id?: number;
  user: User;
  movie: Movie;
  rentalDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status?: RentalStatus;
}
