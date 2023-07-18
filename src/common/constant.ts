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
    secure: true,
    maxAge: Constant.COOKIE_EXPIRES_IN,
    domain: process.env.COOKIE_DOMAIN,
    sameSite: 'none',
  };
  static readonly REDIS_PORT: number = 6379;
  static readonly REDIS_TTL: number = 60 * 60 * 24 * 7; // v4 cache-manager in seconds

  static readonly CACHE_KEY_TOUR_EDITSTATUS: string = 'tourEditStatus';
  static readonly CACHE_KEY_TOURLIKE: string = 'like';
  static readonly CACHE_KEY_USERID: string = 'userId';
  static readonly CACHE_KEY_TOUR: string = 'tour';
  static readonly CACHE_KEY_CREATOR: string = 'creator';
  static readonly CACHE_KEY_ENCODEURL: string = 'encodeUrl';
  static readonly TOUR_CACHE_INVALIDATION_EVENT: string =
    'tourCacheInvalidation';
  // static readonly INVALIDATION_CACHE_SUBSCRIPTION = gql`
  //   subscription {
  //     ${Constant.TOUR_CACHE_INVALIDATION_EVENT} {
  //       cacheKey
  //     }
  //   }`;
  // static readonly PING_MUTATION = gql`
  //   mutation {
  //     ping {
  //       id
  //     }
  //   }
  // `;
  constructor(private readonly configService: ConfigService) {}
}
