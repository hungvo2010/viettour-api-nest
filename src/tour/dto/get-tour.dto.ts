import { TourCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum, Length } from 'class-validator';
import {
  CURSOR_INVALID_VALUE,
  CURSOR_VALID_LENGTH,
  DEFAULT_TOURS_SIZE,
} from './constant';
import { IsHexadecimalString } from 'src/validations/ishex.validation';

export class GetTourDto {
  @IsOptional()
  @Length(CURSOR_VALID_LENGTH, CURSOR_VALID_LENGTH, {
    message: CURSOR_INVALID_VALUE,
  })
  @IsHexadecimalString()
  cursor: string;

  @IsNumber()
  @Type(() => Number)
  size = DEFAULT_TOURS_SIZE;

  @IsEnum(TourCategory)
  @IsOptional()
  public category?: TourCategory;
}
