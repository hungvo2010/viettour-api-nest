import { TourCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum, IsDate } from 'class-validator';

export class GetTourDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsNumber()
  @Type(() => Number)
  size = 10;

  @IsEnum(TourCategory)
  @IsOptional()
  public category?: TourCategory;
}
