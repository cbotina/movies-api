import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { MoviesValidator } from './movies-validator';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, User])],
  providers: [MoviesValidator],
  exports: [MoviesValidator],
})
export class ValidatorsModule {}
