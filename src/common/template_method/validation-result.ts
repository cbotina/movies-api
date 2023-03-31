import { Movie } from 'src/movies/entities/movie.entity';
import { CustomError } from './custom-error.interface';
import { User } from 'src/users/entities/user.entity';

export interface ValidationResult {
  errors?: CustomError[];
  validatedEntities: {
    movie?: Movie;
    user?: User;
  };
}
