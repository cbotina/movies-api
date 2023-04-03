import { ParseArrayPipe, UsePipes } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class QueryFilterDto {
  @MaxLength(64)
  @IsString()
  @IsOptional()
  title?: string;

  @IsBooleanString()
  @IsOptional()
  availability?: string;

  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  tags?: string[];

  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  sort?: string[];
}
