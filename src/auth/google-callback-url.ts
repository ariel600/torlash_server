import { ConfigService } from '@nestjs/config';

/**
 * Passport OAuth2: אם ‎`callbackURL` יחסי או בלי פרוטוקול, הוא ממוזג עם ‎`originalURL(req)` —
 * מאחורי Render זה עלול להפוך ל־‎`http://127.0.0.1:...`. כאן מאלצים URL מוחלט מתוך ‎`GOOGLE_CALLBACK_URL`.
 */
export function resolveGoogleCallbackUrl(config: ConfigService): string {
  const raw = config.getOrThrow<string>('GOOGLE_CALLBACK_URL').trim();
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error(
      'GOOGLE_CALLBACK_URL must be a full URL (e.g. https://torlash-server.onrender.com/api/auth/google/callback)',
    );
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('GOOGLE_CALLBACK_URL must use http:// or https://');
  }
  return u.href;
}
