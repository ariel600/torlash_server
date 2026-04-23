import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Public } from '../auth/public.decorator';

/**
 * בדיקת חיים ללואד־באלנסר / ניטור — ללא JWT.
 */
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @Public()
  getHealth() {
    const mongoOk = this.connection.readyState === 1;
    return {
      ok: mongoOk,
      status: mongoOk ? 'ok' : 'degraded',
      mongo: mongoOk ? 'connected' : 'disconnected',
    };
  }
}
