import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Constant {
  static readonly JWT_EXPIRES_IN = 18000;
  static readonly SALT_ROUNDS: number = 10;
  static COOKIE_EXPIRES_IN = 18000;
  constructor(private readonly configService: ConfigService) {}

  get DATABASE_URL(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get JWT_SECRET(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get NODE_ENV(): string {
    return this.configService.get<string>('NODE_ENV');
  }
}
