import { IsNumber } from 'class-validator';

export class GetTourDto {
  @IsNumber()
  start: number;

  @IsNumber()
  size: number;

  //   @IsOptional()
  //   public category: string;
}
