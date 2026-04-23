import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NedarimPlusSettings,
  NedarimPlusSettingsSchema,
} from '../schemas/nedarim-plus-settings.schema';
import { NedarimPlusSettingsController } from './nedarim-plus-settings.controller';
import { NedarimPlusSettingsService } from './nedarim-plus-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NedarimPlusSettings.name, schema: NedarimPlusSettingsSchema },
    ]),
  ],
  controllers: [NedarimPlusSettingsController],
  providers: [NedarimPlusSettingsService],
  exports: [MongooseModule, NedarimPlusSettingsService],
})
export class NedarimPlusSettingsModule {}
