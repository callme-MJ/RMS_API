import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { exclusions } from './exclude.transform.interceptor';

export interface Response<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    
    if(exclusions) {
      const toExclude = exclusions.find(
        (exclusion) => {
          if(
            (exclusion.path === request.url && exclusion.method === request.method) || 
            (exclusion.path instanceof RegExp && exclusion.path.test(request.url) && exclusion.method === request.method)
          ) {
            return true;
          }
  
          return false;
        }
      );      
  
      if (toExclude) {
        return next.handle();
      }
    }

    return next.handle().pipe(
      map((data) => ({
        data: data != null ? data : null,
        success: true,
      })),
    );
  }
}
