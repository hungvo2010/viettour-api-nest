import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CommonExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    this.logger.log(host);
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      message: exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
