import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUrl,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateMovieDto {
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  description: string;

  @MaxLength(256)
  @IsUrl()
  @IsNotEmpty()
  posterLink: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @MaxLength(256)
  @IsUrl()
  @IsNotEmpty()
  trailerLink: string;

  @IsNumber()
  @IsNotEmpty()
  rentPrice: number;

  @IsNumber()
  @IsNotEmpty()
  salePrice: number;

  @IsNumber()
  @IsNotEmpty()
  likes: number;

  @IsBoolean()
  @IsNotEmpty()
  availability: boolean;
}
