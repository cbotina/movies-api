import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { passwordOptions } from './create-user.dto';

export class ChangePasswordDto {
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
