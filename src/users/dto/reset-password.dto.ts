import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { passwordOptions } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: `User's new password`,
  })
  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: `Reset Password Token`,
  })
  @IsNotEmpty()
  @IsUUID('4')
  token: string;
}
