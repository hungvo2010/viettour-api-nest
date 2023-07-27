import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindAddressDto {
  @IsNumber()
  @Type(() => Number)
  lat = 0;

  @IsNumber()
  @Type(() => Number)
  lng = 0;
}
