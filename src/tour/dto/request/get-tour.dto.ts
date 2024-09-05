import { TourCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class GetTourDto {
  @Type(() => PaginationDto)
  @ValidateNested()
  public pagination: PaginationDto;

  @IsEnum(TourCategory, {
    message: (validateArgs) =>
      `${validateArgs.value} is not a valid tour category`,
  })
  @IsOptional()
  public category?: TourCategory;

  @IsOptional()
  public sort?: string;
}
