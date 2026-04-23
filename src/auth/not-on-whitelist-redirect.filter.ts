import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { NotOnWhitelistException } from './exceptions/not-on-whitelist.exception';
import { sendHtmlClientRedirect } from './html-client-redirect';

@Catch(NotOnWhitelistException)
export class NotOnWhitelistRedirectFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: NotOnWhitelistException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    if (res.headersSent) {
      return;
    }
    const fe = this.config
      .get<string>('FRONTEND_URL', 'http://localhost:5173')
      .replace(/\/$/, '');
    const url = new URL(`${fe}/access-denied`);
    url.searchParams.set('error', 'not_on_whitelist');
    if (exception.email) {
      url.searchParams.set('email', exception.email);
    }
    return sendHtmlClientRedirect(res, url.toString());
  }
}
