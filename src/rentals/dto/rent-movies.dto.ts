import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

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
