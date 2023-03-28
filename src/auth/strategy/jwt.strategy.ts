import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    console.log(req.cookies);

    if (req.cookies && 'jwt' in req.cookies && req.cookies.jwt.length > 0) {
      console.log(req.cookies.jwt);
      return req.cookies.jwt;
    }
    return null;
  }

  async validate(payload: any) {
    console.log('Payload: ', payload);

    return { userId: payload.userId, email: payload.email };
  }
}
