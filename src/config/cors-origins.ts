import { ConfigService } from '@nestjs/config';

/**
 * איחוד ‎`FRONTEND_URL` + ‎`FRONTEND_URLS` (מורידים כפילויות) — CORS מחזיר ‎`Access-Control-Allow-Origin`
 * רק לכתובת שמופיעה ברשימה, חובה ‎*בדיוק* כמו ‎`Origin` מהדפדפן (לרוב בלי ‎`/` בסוף).
 * ב-Render: הגדר ‎`FRONTEND_URL=https://torlash.netlify.app` (או כל דומיין הפרונט), ו/או ‎`FRONTEND_URLS=...`.
 */
function normalizeOrigin(raw: string): string {
  return String(raw).trim().replace(/\/$/, '');
}

function splitOrigins(value: string | undefined): string[] {
  if (value == null || !String(value).trim()) {
    return [];
  }
  return String(value)
    .split(/[,;]+/)
    .map((s) => normalizeOrigin(s))
    .filter(Boolean);
}

export function parseCorsOrigins(config: ConfigService): string | string[] {
  const set = new Set<string>();
  for (const o of splitOrigins(config.get<string | undefined>('FRONTEND_URLS'))) {
    set.add(o);
  }
  const primary = config.get<string>('FRONTEND_URL', 'http://localhost:5173');
  if (primary) {
    set.add(normalizeOrigin(primary));
  }
  for (const o of splitOrigins(config.get<string | undefined>('CORS_EXTRA_ORIGINS'))) {
    set.add(o);
  }

  if (set.size === 0) {
    return 'http://localhost:5173';
  }
  if (set.size === 1) {
    return [...set][0]!;
  }
  return [...set].sort();
}
