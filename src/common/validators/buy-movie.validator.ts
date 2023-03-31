import { InjectRepository } from '@nestjs/typeorm';
import { EntityValidator } from '../template_method/entity-validator';
import { Movie } from 'src/movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BuyMovieValidator extends EntityValidator {
  constructor(
    @InjectRepository(Movie)
    moviesRepository: Repository<Movie>,
    @InjectRepository(User)
    usersRepository: Repository<User>,
  ) {
    super(moviesRepository, usersRepository);
  }
}
