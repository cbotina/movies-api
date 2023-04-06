import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReturnMovieDto {
  @ApiProperty({
    description: `Id of the rental`,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  idRental: number;
}
