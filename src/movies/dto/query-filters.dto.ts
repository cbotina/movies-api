import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBooleanString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class QueryFilterDto {
  @ApiProperty({
    description: `Filter to search movies with certain title`,
    required: false,
  })
  @MaxLength(64)
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: `Filter to search available movies`,
    required: false,
    enum: ['true', 'false'],
  })
  @IsBooleanString()
  @IsOptional()
  availability?: string;

  @ApiProperty({
    description: `Filter to search by tags, you can provide multiple tags separated by commas. e.g. "horror,drama"`,
    type: String,
    required: false,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: `Sort by title or likes. Add a '-' sign before the filter to specify a descendent order. Separate with commas e.g. "title,-likes"`,
    type: String,
    required: false,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  sort?: string[];
}
