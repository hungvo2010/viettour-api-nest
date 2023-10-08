import { Address, UserCategory } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly coverUrl?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly company?: string;

  @IsOptional()
  readonly address?: Address;

  @IsString()
  @IsOptional()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsEnum(UserCategory)
  readonly userCategory?: UserCategory;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly fullname: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly avatarUrl?: string;
}
