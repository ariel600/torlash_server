import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { NotOnWhitelistException } from './exceptions/not-on-whitelist.exception';

/**
 * callback של Google: כישלון כללי (למשל ביטול ב־Google) — ‎`failureRedirect` ל־access-denied
 * / לא ב־whitelist: ‎`info.reason === 'not_on_whitelist'` — ‎`NotOnWhitelistException` + Filter → redirect
 */
@Injectable()
export class GoogleCallbackAuthGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  getAuthenticateOptions(_context: ExecutionContext) {
    const callback = this.config.getOrThrow<string>('GOOGLE_CALLBACK_URL');
    const apiBase = new URL(callback).origin;
    return { failureRedirect: `${apiBase}/api/auth/redirect-bridge` };
  }

  handleRequest(
    err: Error | null,
    user: unknown,
    info: { reason?: string; email?: string } | undefined,
    context: ExecutionContext,
    status?: unknown,
  ) {
    if (err) {
      return super.handleRequest(err, user, info, context, status);
    }
    if (!user && info?.reason === 'not_on_whitelist') {
      throw new NotOnWhitelistException(info.email ?? '');
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
