import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsStrongPasswordOptions,
  IsStrongPassword,
  IsNumber,
  IsOptional,
} from 'class-validator';

export const passwordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export class CreateUserDto {
  @ApiProperty({
    description: `User's name`,
    example: `John`,
  })
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: `User's surname`,
    example: `Doe`,
  })
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({
    description: `User's password`,
  })
  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: `User's email`,
    example: `johndoe@example.com`,
  })
  @MaxLength(64)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `User's balance`,
    example: 25,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  balance?: number;
}
