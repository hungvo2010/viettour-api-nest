import { TourCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import {
  CURSOR_INVALID_VALUE,
  CURSOR_VALID_LENGTH,
  DEFAULT_TOURS_SIZE,
} from './constant';

export class GetTourDto {
  @IsOptional()
  @IsString({
    message: CURSOR_INVALID_VALUE,
  })
  @MinLength(CURSOR_VALID_LENGTH)
  cursor: string;

  @IsNumber()
  @Type(() => Number)
  size = DEFAULT_TOURS_SIZE;

  @IsEnum(TourCategory)
  @IsOptional()
  public category?: TourCategory;
}
