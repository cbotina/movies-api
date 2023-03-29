import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';
import { Roles } from '../entities/user.entity';

export class CreateUserDto {
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  name: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  surname: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  username: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
