import { PartialType } from '@nestjs/mapped-types';
import { RegisterAuthDto } from './register-auth.dto';

export class UpdateAuthDto extends PartialType(RegisterAuthDto) {}
