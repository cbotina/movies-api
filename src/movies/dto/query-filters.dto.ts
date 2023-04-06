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
    example: `terminator`,
    required: false,
  })
  @MaxLength(64)
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: `Filter to search available movies`,
    example: true,
    required: false,
  })
  @IsBooleanString()
  @IsOptional()
  availability?: string;

  @ApiProperty({
    description: `Filter to search by tags, you can provide multiple tags separated by commas`,
    example: `horror,drama,comedy`,
    required: false,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: `Sort by title or likes. Add a '-' sign before the filter to specify a descendent order`,
    example: `likes,-title`,
    required: false,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  sort?: string[];
}
