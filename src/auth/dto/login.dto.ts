import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsEmail } from 'class-validator';
export class LoginDto {
  @ApiProperty({
    description: `User's email`,
    example: `johndoe@gmail.com`,
  })
  @MaxLength(64)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `User's password`,
    example: `RandomPassword1234@`,
  })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string;
}
