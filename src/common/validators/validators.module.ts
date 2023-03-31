import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { BuyMovieValidator } from './buy-movie.validator';
import { RentMovieValidator } from './rent-movie.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, User])],
  providers: [BuyMovieValidator, RentMovieValidator],
  exports: [BuyMovieValidator, RentMovieValidator],
})
export class ValidatorsModule {}
