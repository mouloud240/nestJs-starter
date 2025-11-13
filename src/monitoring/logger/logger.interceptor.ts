import {
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Observable, tap } from 'rxjs';
import { LoggerStore } from './interfaces/logger_store.interface';
import { ASYNC_STORAGE } from 'src/common/constants/injection';

/**
 * Interceptor for logging HTTP and GraphQL requests
 *
 * Supports both HTTP (REST) and GraphQL contexts
 * Tracks request timing, IP address, path/operation, and response status
 * Uses AsyncLocalStorage to maintain requestId throughout the request lifecycle
 *
 * @example
 * // Apply globally in main.ts
 * app.useGlobalInterceptors(new LoggerInterceptor(asyncLocalStorage));
 */
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
    const gqlContext = GqlExecutionContext.create(context);
    const isGraphQL = gqlContext.getType() === 'graphql';

    let request: Request;
    let requestPath: string;
    let requestMethod: string;

    if (isGraphQL) {
      // GraphQL context
      request = gqlContext.getContext().req;
      const info = gqlContext.getInfo();
      requestPath = `GraphQL/${info.fieldName}`;
      requestMethod = info.operation.operation.toUpperCase(); // query or mutation
    } else {
      // HTTP context
      request = context.switchToHttp().getRequest<Request>();
      requestPath = request.path;
      requestMethod = request.method;
    }

    const userIp = request.ip;
    //Allow client to pass requestId for better traceability across services
    //If not present, generate a new one
    //and set it in AsyncLocalStorage store and headers
    const clientRequestId = request.headers['x-request-id'];
    const requestId = crypto.randomUUID();

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
          let statusCode: number;
          if (isGraphQL) {
            // GraphQL always returns 200 for successful operations
            statusCode = 200;
          } else {
            statusCode = context.switchToHttp().getResponse<Response>()
              .statusCode;
          }

          const endTime = Date.now();
          const responseTime = endTime - startTime;
          this.logger.log(
            `✅ Response completed in ${responseTime}ms ${responseTime < 100 ? '🔥' : responseTime < 300 ? `🌀` : '🐢'} with Status:${statusCode}`,
          );
        }),
      );
  }
}
