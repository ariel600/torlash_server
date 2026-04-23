import { ConfigService } from '@nestjs/config';
import type { CookieOptions } from 'express';

/**
 * פרודקשן: Netlify (פרונט) ↔ Render (API) — דפדפן שולח עוגיה רק עם ‎`SameSite=None` + ‎`Secure`.
 * ‎`AUTH_COOKIE_DOMAIN` אופציונלי (למשל ‎`.onrender.com`); ריק = host-only של השרת.
 */
export function getAuthCookieSetOptions(config: ConfigService, maxAge: number): CookieOptions {
  const base = getAuthCookieBaseOptions(config);
  return { ...base, maxAge };
}

/** אותן אפשרויות כמו ב־‎`Set-Cookie` — נדרש ל־‎`clearCookie` כדי למחוק עוגיית צד־שלישי */
export function getAuthCookieClearOptions(config: ConfigService): CookieOptions {
  return getAuthCookieBaseOptions(config);
}

function getAuthCookieBaseOptions(config: ConfigService): CookieOptions {
  const isProd = config.get<string>('NODE_ENV', '') === 'production';
  const domainRaw = (config.get<string>('AUTH_COOKIE_DOMAIN') ?? '').trim();
  const domain = domainRaw.length > 0 ? domainRaw : undefined;

  if (isProd) {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      ...(domain ? { domain } : {}),
    };
  }

  return {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  };
}
