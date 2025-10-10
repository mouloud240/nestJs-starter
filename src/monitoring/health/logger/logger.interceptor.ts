import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  logger = new Logger(LoggerInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const userIp = request.ip;

    const requestPath = request.path;
    const requestMethod = request.method;

    this.logger.log(
      `🚀 Request started from IP: ${userIp}, Path: ${requestPath}, Method: ${requestMethod} at ${new Date(startTime).toISOString()}`,
    );
    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        this.logger.log(
          `✅ Response completed in ${responseTime}ms ${responseTime < 100 ? '🔥' : responseTime < 300 ? `🌀` : '🐢'}`,
        );
      }),
    );
  }
}
