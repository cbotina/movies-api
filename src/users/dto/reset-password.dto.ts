import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { passwordOptions } from './create-user.dto';

export class ResetPasswordDto {
  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  @IsUUID('4')
  token: string;
}
