import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class Constant {
  static readonly JWT_EXPIRES_IN = 18000; // in seconds
  static readonly SALT_ROUNDS: number = 10;
  static COOKIE_EXPIRES_IN = 18000000; // in milliseconds
  static readonly EVERY_2_MINUTES = '*/2 * * * *';
  static readonly COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: Constant.COOKIE_EXPIRES_IN,
    domain: process.env.COOKIE_DOMAIN,
    sameSite: 'none',
  };
  static readonly REDIS_PORT: number = 6379;
  static readonly REDIS_TTL: number = 60 * 60; // v4 cache-manager in seconds

  static readonly CACHE_KEY_TOURVIEW: string = 'view';
  static readonly CACHE_KEY_TOURLIKE: string = 'like';
  static readonly CACHE_KEY_USERID: string = 'userId';
  static readonly CACHE_KEY_TOUR: string = 'tour';
  static readonly CACHE_KEY_CREATOR: string = 'creator';
  static readonly CACHE_KEY_ENCODEURL: string = 'encodeUrl';
  static readonly MAX_DISTANCE: number = 7500; // in meters
  constructor(private readonly configService: ConfigService) {}
}
