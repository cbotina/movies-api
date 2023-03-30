import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateSaleDto {
  id?: number;
  user: User;
  movie: Movie;
  quantity: number;
  datePurchased: Date;
}
