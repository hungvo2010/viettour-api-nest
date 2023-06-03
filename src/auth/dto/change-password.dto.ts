import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  confirmPassword: string;
}
