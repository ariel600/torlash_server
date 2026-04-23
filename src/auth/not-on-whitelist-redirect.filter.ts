import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { NotOnWhitelistException } from './exceptions/not-on-whitelist.exception';
import { sendHtmlClientRedirect } from './html-client-redirect';
import { getFrontendBaseUrl } from '../config/frontend-url';

@Catch(NotOnWhitelistException)
export class NotOnWhitelistRedirectFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: NotOnWhitelistException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    if (res.headersSent) {
      return;
    }
    const fe = getFrontendBaseUrl(this.config);
    const url = new URL(`${fe}/access-denied`);
    url.searchParams.set('error', 'not_on_whitelist');
    if (exception.email) {
      url.searchParams.set('email', exception.email);
    }
    return sendHtmlClientRedirect(res, url.toString());
  }
}
