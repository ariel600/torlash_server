import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureRequest, FeatureRequestSchema } from '../schemas/feature-request.schema';
import { FeatureRequestsController } from './feature-requests.controller';
import { FeatureRequestsService } from './feature-requests.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeatureRequest.name, schema: FeatureRequestSchema },
    ]),
  ],
  controllers: [FeatureRequestsController],
  providers: [FeatureRequestsService],
  exports: [MongooseModule, FeatureRequestsService],
})
export class FeatureRequestsModule {}
