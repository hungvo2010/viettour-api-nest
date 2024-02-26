  import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
  import { Observable, map } from 'rxjs';

  export class TimestampInterceptor implements NestInterceptor {
    intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
        map((data) => {
          return {
            ...data as object,
            timestamp: new Date().toISOString(),
          };
        }),
      );
    }
  }
