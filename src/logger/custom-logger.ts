import { ConsoleLogger } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/common/data/JwtPayload';

export class CustomLogger extends ConsoleLogger {
  logInfo(payload: JwtPayload, request: Request, ...message: string[]): void {
    super.log(this.basicLog(payload, request), message);
  }

  error(message: string, trace: string): void {
    super.error(message, trace);
  }

  warn(message: string) {
    super.warn(message);
  }

  debug(message: string) {
    super.debug(message);
  }

  verbose(message: string) {
    super.verbose(message);
  }

  basicLog(payload: JwtPayload, request: Request) {
    var logMessage = new Array<string>(
      payload.userId,
      payload.email,
      'path: ' + request.originalUrl,
    );
    return logMessage.join('|');
  }
}
