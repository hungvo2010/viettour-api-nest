import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  requestId: string;
  userId: string;
  email: string;
  originalRequest: Request;
  constructor(@Inject(REQUEST) private request: Request) {
    var jwtString = ExtractJwt.fromExtractors([JwtStrategy.extractJWT])(
      request,
    );
    var jwtObj = decode(jwtString);
    this.email = jwtObj['email'];
    this.userId = jwtObj['userId'];
    this.requestId = uuidv4();
    this.originalRequest = request;
  }
}
