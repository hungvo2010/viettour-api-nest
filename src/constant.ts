import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Constant {
  static readonly JWT_EXPIRES_IN = 18000000;
  static readonly SALT_ROUNDS: number = 10;
  static COOKIE_EXPIRES_IN = 18000000;
  constructor(private readonly configService: ConfigService) {}
}
