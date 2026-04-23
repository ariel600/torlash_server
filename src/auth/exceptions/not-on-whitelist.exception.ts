import { UnauthorizedException } from '@nestjs/common';

/** OAuth Google: אימייל אינו ב־DB / לא פעיל — בלי JWT; ה־ExceptionFilter מבצע redirect לפרונט */
export class NotOnWhitelistException extends UnauthorizedException {
  constructor(public readonly email: string) {
    super({ code: 'not_on_whitelist', email: email || '' });
  }
}
