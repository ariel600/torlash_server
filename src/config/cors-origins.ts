import { ConfigService } from '@nestjs/config';

/**
 * ‎`FRONTEND_URLS` — רשימה מופרדת בפסיקים או נקודה־פסיק (דומיין חדש + ישן + localhost).
 * אם ריק — משתמשים ב־‎`FRONTEND_URL` (ברירת מחדל לפיתוח).
 */
export function parseCorsOrigins(config: ConfigService): string | string[] {
  const multi = config.get<string | undefined>('FRONTEND_URLS');
  if (multi != null && String(multi).trim() !== '') {
    const list = String(multi)
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 1) {
      return list[0];
    }
    if (list.length > 1) {
      return list;
    }
  }
  return config.get<string>('FRONTEND_URL', 'http://localhost:5173');
}
