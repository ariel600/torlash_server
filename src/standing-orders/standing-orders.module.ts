import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StandingOrder, StandingOrderSchema } from '../schemas/standing-order.schema';
import { StandingOrdersController } from './standing-orders.controller';
import { StandingOrdersService } from './standing-orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StandingOrder.name, schema: StandingOrderSchema },
    ]),
  ],
  controllers: [StandingOrdersController],
  providers: [StandingOrdersService],
  exports: [MongooseModule, StandingOrdersService],
})
export class StandingOrdersModule {}
