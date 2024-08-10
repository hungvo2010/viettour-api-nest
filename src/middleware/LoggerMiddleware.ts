import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/common/data/JwtPayload';
import { CustomLogger } from 'src/logger/custom-logger';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger();
  use(req: Request, res: Response, next: NextFunction) {
    var jwtString = ExtractJwt.fromExtractors([JwtStrategy.extractJWT])(req);
    var jwtObj = decode(jwtString);
    var jwtPayload: JwtPayload = new JwtPayload(
      jwtObj['userId'],
      jwtObj['email'],
    );
    this.logger.logInfo(jwtPayload, req);
    next();
  }
}
