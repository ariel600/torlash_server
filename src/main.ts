import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SanitizeMongoBodyInterceptor } from './common/interceptors/sanitize-mongo-body.interceptor';
import { parseCorsOrigins } from './config/cors-origins';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );
  app.use(cookieParser());
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
  await app.listen(port);
  logger.log(`Server listening on http://localhost:${port}`);
}

void bootstrap().catch((err: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(err instanceof Error ? err.message : String(err), err instanceof Error ? err.stack : undefined);
  process.exit(1);
});