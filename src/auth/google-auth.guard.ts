import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * התחלת OAuth מול Google (Passport strategy ‎'google'‎).
 * הנתיב המלא: ‎`/api/auth/google` (עם ‎`setGlobalPrefix('api')` + ‎`@Controller('auth')` — בלי ‎`api` כפול).
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
