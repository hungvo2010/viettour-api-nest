import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class Constant {
  static readonly JWT_EXPIRES_IN = 18000; // in seconds
  static readonly SALT_ROUNDS: number = 10;
  static COOKIE_EXPIRES_IN = 18000000; // in milliseconds
  static readonly COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: Constant.COOKIE_EXPIRES_IN,
  };
  constructor(private readonly configService: ConfigService) {}
}
