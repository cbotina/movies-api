import { CustomError } from './custom-error.interface';
import { User } from 'src/users/entities/user.entity';
import { MovieTransactionObject } from 'src/sales/dto/buy-movies.dto';

export interface ValidationResult {
  errors: CustomError[];
  movieObjects: MovieTransactionObject[];
  user: User;
}
