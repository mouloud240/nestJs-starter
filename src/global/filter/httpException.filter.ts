import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';

    this.logger.warn(`HTTP Exception: Status ${status} - Message: ${message}`);
    this.logger.error(exception.cause);
    response.status(status).json({
      statusCode: status,
      message: message,
      success: false,
      timestamp: new Date().toISOString(),
    });
  }
}
