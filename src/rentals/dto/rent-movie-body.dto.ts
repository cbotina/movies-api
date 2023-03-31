import { IsNotEmpty, IsNumber } from 'class-validator';

export class RentMovieDto {
  @IsNumber()
  @IsNotEmpty()
  days: number;
}
