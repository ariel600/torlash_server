import { Response } from 'express';

/**
 * מניעה של redirect שרשת/דפדפנים (למשל כללים בין-מקוריים) — טוען HTML קטן שמבצע
 * מעבר בצד הלקוח.
 */
export function sendHtmlClientRedirect(res: Response, targetUrl: string): void {
  if (res.headersSent) {
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).send(
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>…</title></head><body>' +
      `<script>window.location.replace(${JSON.stringify(targetUrl)});</script>` +
      '</body></html>',
  );
}
