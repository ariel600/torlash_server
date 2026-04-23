import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { resolveGoogleCallbackUrl } from './google-callback-url';

/**
 * התחלת OAuth מול Google (Passport strategy ‎'google'‎).
 * הנתיב המלא: ‎`/api/auth/google` (עם ‎`setGlobalPrefix('api')` + ‎`@Controller('auth')` — בלי ‎`api` כפול).
 * ‎`callbackURL` מועבר מפורשות מ־‎`GOOGLE_CALLBACK_URL` — לא סמך על זיהוי host מ־‎`req`.
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  getAuthenticateOptions(_context: ExecutionContext) {
    return { callbackURL: resolveGoogleCallbackUrl(this.config) };
  }
}
