import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsStrongPasswordOptions,
  IsStrongPassword,
} from 'class-validator';

const passwordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export class CreateUserDto {
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  name: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(64)
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
