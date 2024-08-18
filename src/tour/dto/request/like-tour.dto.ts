import { IsNumber } from 'class-validator';

export class LikeTourDto {
  @IsNumber()
  liked: number;
}
