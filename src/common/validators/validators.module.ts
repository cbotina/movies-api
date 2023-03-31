import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { BuyMovieValidator } from './buy-movie.validator';
import { RentMovieValidator } from './rent-movie.validator';
import { ReturnMovieValidator } from './return-movie.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, User])],
  providers: [BuyMovieValidator, RentMovieValidator, ReturnMovieValidator],
  exports: [BuyMovieValidator, RentMovieValidator, ReturnMovieValidator],
})
export class ValidatorsModule {}
