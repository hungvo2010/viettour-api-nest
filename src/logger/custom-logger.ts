import { ConsoleLogger } from '@nestjs/common';
import { RequestContext } from 'src/common/data/context/RequestContext';

export class CustomLogger extends ConsoleLogger {
  logInfo(context: any, ...message: any[]) {
    this.log(this.basicLog(context, ...message as string[]));
  }

  // logInfo(context: RequestContext, ...message: string[]);

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

  basicLog(context: RequestContext, ...message: string[]) {
    var logMessage = new Array<string>(
      context.userId,
      context.email,
      'path: ' + context.originalRequest.originalUrl,
    );
    logMessage.push(...message);
    return logMessage.join('|');
  }
}
