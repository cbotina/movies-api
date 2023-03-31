import { IsString, IsNotEmpty, MaxLength, IsEmail } from 'class-validator';
export class LoginDto {
  @MaxLength(64)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string;
}
