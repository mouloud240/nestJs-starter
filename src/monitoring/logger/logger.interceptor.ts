import {
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Observable, tap } from 'rxjs';
import { LoggerStore } from './interfaces/logger_store.interface';
import { ASYNC_STORAGE } from 'src/common/constants/injection';

export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly alsService: AsyncLocalStorage<LoggerStore>,
  ) {}
  logger = new Logger(LoggerInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const userIp = request.ip;
    //Allow client to pass requestId for better traceability across services
    //If not present, generate a new one
    //and set it in AsyncLocalStorage store and headers
    const clientRequestId = request.headers['x-request-id'];
    const requestId = crypto.randomUUID();

    const requestPath = request.path;
    const requestMethod = request.method;

    this.logger.log(
      `🚀 Request started from IP: ${userIp}, Path: ${requestPath}, Method: ${requestMethod} at ${new Date(startTime).toISOString()}`,
    );
    const store = {
      requestId: requestId,
    };
    //Execute the request within the AsyncLocalStorage context
    // so that the store is available throughout the request lifecycle
    return this.alsService
      .run<Observable<any>>(store, () => {
        return next.handle();
      })
      .pipe(
        tap(() => {
          const statusCode = context
            .switchToHttp()
            .getResponse<Response>().statusCode;
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          this.logger.log(
            `✅ Response completed in ${responseTime}ms ${responseTime < 100 ? '🔥' : responseTime < 300 ? `🌀` : '🐢'} with Status:${statusCode}`,
          );
        }),
      );
  }
}
