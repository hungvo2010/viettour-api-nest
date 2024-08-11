import { ConsoleLogger } from '@nestjs/common';
import { RequestContext } from 'src/common/data/context/RequestContext';

export class CustomLogger extends ConsoleLogger {
  logInfo(context: RequestContext) {
    this.log(this.basicLog(context));
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

  basicLog(context: RequestContext) {
    var logMessage = new Array<string>(
      context.userId,
      context.email,
      'path: ' + context.originalRequest.originalUrl,
    );
    return logMessage.join('|');
  }
}
