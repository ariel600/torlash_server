import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SanitizeMongoBodyInterceptor } from './common/interceptors/sanitize-mongo-body.interceptor';
import { resolveGoogleCallbackUrl } from './auth/google-callback-url';
import { parseCorsOrigins } from './config/cors-origins';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const expressApp = app.getHttpAdapter().getInstance() as {
    set?: (key: string, value: unknown) => void;
  };
  /** לפני כל middleware — חשוב ל־‎`req.secure` / ‎`X-Forwarded-Proto` מאחורי Render */
  expressApp.set?.('trust proxy', 1);

  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);
  console.log('Google Callback URL:', resolveGoogleCallbackUrl(config));

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );
  app.useGlobalInterceptors(new SanitizeMongoBodyInterceptor());

  // כל הנתיבים ב-Nest כוללים /api — לדוגמה /api/auth/google/callback
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const functionsVersionHeader = 'Base' + 44 + '-Functions-Version';
  const corsOrigin = parseCorsOrigins(config);
  if (Array.isArray(corsOrigin)) {
    logger.log(`CORS: ${corsOrigin.length} מקורות — ${corsOrigin.join(', ')}`);
  } else {
    logger.log(`CORS: ${corsOrigin}`);
  }
  // ‎`credentials: true` — fetch עם ‎`credentials: 'include'` (עוגיות) + CORS: מקור ‎`Origin` חייב
  // לכלול *בדיוק* את ‎`FRONTEND_URL` (למשל ‎`https://torlash.netlify.app` ב-Render).
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    // OPTIONS: preflight; HEAD: חשובות ל-redirect / בדיקות
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-App-Id',
      'X-Origin-URL',
      functionsVersionHeader,
    ],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  const url = await app.getUrl();
  logger.log('Application is running on: ' + url);
  logger.log(
    'Listen URL above may show 127.0.0.1 when bound to 0.0.0.0; OAuth redirect_uri follows GOOGLE_CALLBACK_URL (see startup log).',
  );
}

void bootstrap().catch((err: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(err instanceof Error ? err.message : String(err), err instanceof Error ? err.stack : undefined);
  process.exit(1);
});