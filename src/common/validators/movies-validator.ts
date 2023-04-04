import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { CustomError } from '../template_method/custom-error.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { BuyMovieObject, Purchase } from 'src/sales/dto/buy-movies.dto';

@Injectable()
export class MoviesValidator {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async validate(purchases: Purchase[], userId: number) {
    const errors: CustomError[] = [];
    const movieObjects: BuyMovieObject[] = [];

    const user = await this.checkUser(userId);
    const error = this.validateUser(user);

    if (error) errors.push(error);

    for (const purchase of purchases) {
      const movie = await this.checkMovie(purchase.movieId);
      const error = this.validateMovie(movie, purchase.movieId);
      if (error) {
        errors.push(error);
      } else {
        movieObjects.push({ movie, quantity: purchase.quantity });
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
