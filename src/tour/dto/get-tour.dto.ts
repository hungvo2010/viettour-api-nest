import { TourCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum } from 'class-validator';

export class GetTourDto {
  @IsNumber()
  @Type(() => Number)
  start = 0;

  @IsNumber()
  @Type(() => Number)
  size = 10;

  @IsEnum(TourCategory)
  @IsOptional()
  public category?: TourCategory;
}
