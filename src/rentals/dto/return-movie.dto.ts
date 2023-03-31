import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReturnMovieDto {
  @IsNumber()
  @IsNotEmpty()
  idRental: number;
}
