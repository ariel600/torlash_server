import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { stripMongoOperators } from '../security/mongo-sanitize.util';

/**
 * מנקה ‎`req.body` מפני ‎`$` בשורש ובמקוננים לפני טיפול ב-Controllers.
 * אין לוגים כאן — אסור להוסיף ‎`console.log` / לוגר עם ‎`body` או ‎`Authorization` / JWT.
 */
@Injectable()
export class SanitizeMongoBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest() as { body?: unknown; method?: string };
    if (
      req?.body != null &&
      typeof req.body === 'object' &&
      !Array.isArray(req.body) &&
      (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')
    ) {
      req.body = stripMongoOperators(req.body as Record<string, unknown>);
    }
    return next.handle();
  }
}
