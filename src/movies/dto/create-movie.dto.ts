import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUrl,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: `Movie's title`,
    example: `The return of the one who never left`,
  })
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: `Movie's description`,
    example: `This is a heart-wrenching drama that tells the story of a woman named Sarah who disappeared without a trace 10 years ago.`,
  })
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: `Link to the movie's poster`,
    example: `google.com/images`,
  })
  @MaxLength(256)
  @IsUrl()
  @IsNotEmpty()
  posterLink: string;

  @ApiProperty({
    description: `Amount of copies available`,
    example: 12,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: `Link to the movie's trailer`,
    example: `https://www.youtube.com/watch?v=S014oGZiSdI`,
  })
  @MaxLength(256)
  @IsUrl()
  @IsNotEmpty()
  trailerLink: string;

  @ApiProperty({
    description: `Price of renting the movie for one day`,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  rentPrice: number;

  @ApiProperty({
    description: `Price to buy the movie`,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  salePrice: number;

  @ApiProperty({
    description: `Number of likes of the movie`,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  likes: number;

  @ApiProperty({
    description: `Availability of the movie`,
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  availability: boolean;
}
