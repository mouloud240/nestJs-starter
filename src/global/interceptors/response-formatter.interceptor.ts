import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          timeStamp: new Date().toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data,
        };
      }),
    );
  }
}
