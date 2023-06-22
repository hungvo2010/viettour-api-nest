import { IsNotEmpty, IsString } from 'class-validator';

export class IdTokenDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
