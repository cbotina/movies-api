import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { CustomError } from './custom-error.interface';
import { HttpStatus } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ValidationResult } from './validation-result';

export abstract class EntityValidator {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async validate(
    movieId: number,
    userId: number,
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      errors: undefined,
      validatedEntities: {
        movie: undefined,
        user: undefined,
      },
    };
    const errores = [];

    const movie = await this.checkMovie(movieId);
    const movieError = this.validateMovie(movie);
    if (movieError) errores.push(movieError);
    result.validatedEntities.movie = movie;

    const user = await this.checkUser(userId);
    const userError = this.validateUser(user);
    if (userError) errores.push(userError);
    result.validatedEntities.user = user;
    result.errors = errores;

    return result;
  }

  protected async checkMovie(movieId: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id: movieId });
    return movie;
  }

  protected validateMovie(movie: Movie): CustomError {
    if (!movie) {
      return { message: `Movie not found`, status: HttpStatus.NOT_FOUND };
    }
    if (movie.stock === 0) {
      return { message: `Movie out of stock`, status: HttpStatus.CONFLICT };
    }

    if (!movie.availability) {
      return {
        message: `Movie not available`,
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
