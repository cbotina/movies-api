import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Movie } from 'src/movies/entities/movie.entity';

export class Purchase {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class BuyMoviesDto {
  @ApiProperty({
    description: `Array of movies to purchase`,
    example: [
      { movieId: 1, quantity: 2 },
      { movieId: 2, quantity: 4 },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => Purchase)
  @IsNotEmpty()
  movies: Purchase[];
}

export type MovieTransactionObject = {
  movie: Movie;
  amount: number;
};
