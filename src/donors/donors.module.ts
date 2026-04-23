import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Donor, DonorSchema } from '../schemas/donor.schema';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Donor.name, schema: DonorSchema }]),
  ],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [MongooseModule, DonorsService],
})
export class DonorsModule {}
