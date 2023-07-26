import { TourCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum } from 'class-validator';

export class LikeTourDto {
  @IsNumber()
  liked: number;
}
