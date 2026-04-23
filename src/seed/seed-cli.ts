import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersSeedService } from './users-seed.service';

const log = new Logger('SeedCLI');

/**
 * ‎`npm run db:seed` — הזרקת admin מ-‎`SEED_ADMIN_EMAIL` + ‎`SEED_ADMIN_NAME` ב-‎`server/.env` בלבד.
 */
async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  const seed = app.get(UsersSeedService);
  const m = await seed.upsertAdminFromEnv();
  if (m === 0) {
    log.warn('הגדר ‎SEED_ADMIN_EMAIL=... ו-‎SEED_ADMIN_NAME=... ב־server/.env');
    await app.close();
    process.exitCode = 1;
    return;
  }
  log.log('הושלם. המשתמש הוזן/עודכן ב-DB.');
  await app.close();
  process.exit(0);
}
void run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
