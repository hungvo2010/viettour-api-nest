import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Address, UserCategory } from '@prisma/client';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
}
