import { ConfigService } from '@nestjs/config';

const DEFAULT_DEV_FRONTEND = 'http://localhost:5173';

/**
 * בסיס URL של הפרונט ל־redirects (ללא סלאש בסוף), מתוך ‎`FRONTEND_URL` ב־.env.
 */
export function getFrontendBaseUrl(config: ConfigService): string {
  return String(config.get<string>('FRONTEND_URL', DEFAULT_DEV_FRONTEND) ?? DEFAULT_DEV_FRONTEND).replace(
    /\/$/,
    '',
  );
}
