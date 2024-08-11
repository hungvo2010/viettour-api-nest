import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CommonExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception, exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      message: 'Internal Server Error',
      statusCode: status,
      path: request.originalUrl,
    });
  }
}
