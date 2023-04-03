import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Roles } from '../entities/user.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'password',
]) {
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}
