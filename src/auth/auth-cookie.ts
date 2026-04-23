import { ConfigService } from '@nestjs/config';
import type { CookieOptions } from 'express';

/**
 * פרודקשן: Netlify (פרונט) ↔ Render (API) — ‎`SameSite=None` + ‎`Secure`.
 * ללא ‎`domain` — host-only (דומיין השרת), כדי שהדפדפן ישייך את העוגיה אוטומטית.
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

  if (isProd) {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    };
  }

  return {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  };
}
