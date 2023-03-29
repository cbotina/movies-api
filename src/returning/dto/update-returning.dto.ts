import { PartialType } from '@nestjs/mapped-types';
import { CreateReturningDto } from './create-returning.dto';

export class UpdateReturningDto extends PartialType(CreateReturningDto) {}
