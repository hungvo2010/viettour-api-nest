import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Address, UserCategory } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly coverUrl?: string;
  @IsString()
  readonly description?: string;

  @IsString()
  readonly company?: string;

  readonly address?: Address;

  @IsString()
  readonly phoneNumber?: string;
  readonly userCategory?: UserCategory;
}
