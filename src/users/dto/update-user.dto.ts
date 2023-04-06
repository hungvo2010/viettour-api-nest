import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Address, UserCategory } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  readonly coverUrl?: string;
  readonly description?: string;
  readonly company?: string;
  readonly address?: Address;
  readonly phoneNumber?: string;
  readonly userCategory?: UserCategory;
}
