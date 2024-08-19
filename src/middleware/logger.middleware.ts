import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestContext } from 'src/common/data/context/RequestContext';
import { CustomLogger } from 'src/logger/custom-logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger();
  constructor(private readonly context: RequestContext) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.logInfo(this.context);
    next();
  }
}
