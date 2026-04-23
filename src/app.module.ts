import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { DonorPaymentsModule } from './donor-payments/donor-payments.module';
import { DonorsModule } from './donors/donors.module';
import { DeletedStudentsModule } from './deleted-students/deleted-students.module';
import { FeatureRequestsModule } from './feature-requests/feature-requests.module';
import { NedarimPlusSettingsModule } from './nedarim-plus-settings/nedarim-plus-settings.module';
import { StandingOrdersModule } from './standing-orders/standing-orders.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000,
          limit: 200,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      /** קריאה מ-`server/.env` גם כשהרצה היא משורש המונו-רפו */
      envFilePath: [
        join(__dirname, '..', '.env.local'),
        join(__dirname, '..', '.env'),
        '.env.local',
        '.env',
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    StudentsModule,
    DeletedStudentsModule,
    DonorsModule,
    DonorPaymentsModule,
    StandingOrdersModule,
    NedarimPlusSettingsModule,
    FeatureRequestsModule,
    UsersModule,
    AuthModule,
    SeedModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
