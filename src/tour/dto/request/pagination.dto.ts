import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Length } from 'class-validator';
import { IsHexadecimalString } from 'src/validations/ishex.validation';
import {
    CURSOR_INVALID_VALUE,
    CURSOR_VALID_LENGTH,
    DEFAULT_TOURS_SIZE,
} from './constant';

export class PaginationDto {
  @IsOptional()
  @Length(CURSOR_VALID_LENGTH, CURSOR_VALID_LENGTH, {
    message: CURSOR_INVALID_VALUE,
  })
  @IsHexadecimalString()
  cursor: string;

  @IsNumber()
  @Type(() => Number)
  offset = DEFAULT_TOURS_SIZE;

  @IsNumber()
  @Type(() => Number)
  limit = 0;
}
