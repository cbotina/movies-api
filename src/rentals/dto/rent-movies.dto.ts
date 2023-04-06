import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class RentalOrder {
  @ApiProperty({
    description: `Id of the movie to rent`,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({
    description: `Number of days to rent the movie`,
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  days: number;
}

export class RentMoviesDto {
  @ApiProperty({
    type: new RentalOrder(),
    description: `An array of rental orders to be processed`,
    example: [
      { movieId: 1, days: 1 },
      { movieId: 2, days: 2 },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => RentalOrder)
  @IsNotEmpty()
  movies: RentalOrder[];
}
