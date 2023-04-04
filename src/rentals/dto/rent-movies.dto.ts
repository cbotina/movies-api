import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Movie } from 'src/movies/entities/movie.entity';

export class RentalOrder {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsNumber()
  @IsNotEmpty()
  days: number;
}

export class RentMoviesDto {
  @ValidateNested({ each: true })
  @Type(() => RentalOrder)
  @IsNotEmpty()
  movies: RentalOrder[];
}
