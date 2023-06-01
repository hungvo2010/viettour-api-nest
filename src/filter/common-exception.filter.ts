import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import e, { Request, Response } from 'express';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CommonExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const errors = exception.getResponse().message;

    // Log the error messages
    this.logger.log(errors);

    response.status(status).json({
      message: exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
