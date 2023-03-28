import { IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  // @Matches('password')
  confirmPassword: string;
}
