import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus()
    const message = exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: message,
      success: false,
      timestamp: new Date().toISOString(),
    });
  }
}
