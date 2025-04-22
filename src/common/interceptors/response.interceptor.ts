/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          // Wrap the successful response in the standardized format
          return {
            success: true,
            data,
            message: 'Request was successful',
          };
        }

        return {
          success: false,
          message: 'Unexpected error occurred',
          data: null,
        };
      }),
    );
  }
}
