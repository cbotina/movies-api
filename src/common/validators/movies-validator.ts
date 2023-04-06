import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { CustomError } from '../template_method/custom-error.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { MovieTransactionObject } from 'src/sales/dto/buy-movies.dto';
import { Order } from './entities/order.entity';
import { ValidationResult } from '../template_method/validation-result';

@Injectable()
export class MoviesValidator {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async validate(
    orders: Order[],
    userId: number,
  ): Promise<ValidationResult> {
    const errors: CustomError[] = [];
    const movieObjects: MovieTransactionObject[] = [];

    const user = await this.checkUser(userId);
    const error = this.validateUser(user);

    if (error) errors.push(error);

    for (const order of orders) {
      const movie = await this.checkMovie(order.movieId);
      const error = this.validateMovie(movie, order.movieId);
      if (error) {
        errors.push(error);
      } else {
        movieObjects.push({ movie, amount: order.amount });
      }
    }

    return { errors, movieObjects, user };
  }

  protected async checkMovie(movieId: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id: movieId });
    return movie;
  }

  protected validateMovie(movie: Movie, movieId: number): CustomError {
    if (!movie) {
      return {
        message: `Movie #${movieId} not found`,
        status: HttpStatus.NOT_FOUND,
      };
    }
    if (movie.stock === 0) {
      return {
        message: `Movie #${movieId} out of stock`,
        status: HttpStatus.CONFLICT,
      };
    }

    if (!movie.availability) {
      return {
        message: `Movie #${movieId} not available`,
        status: HttpStatus.SERVICE_UNAVAILABLE,
      };
    }
    return null;
  }

  protected async checkUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    return user;
  }

  protected validateUser(user: User): CustomError {
    if (!user) {
      return { message: `User not found`, status: HttpStatus.NOT_FOUND };
    }

    return null;
  }
}
