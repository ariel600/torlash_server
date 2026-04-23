import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonorPayment, DonorPaymentSchema } from '../schemas/donor-payment.schema';
import { DonorPaymentsController } from './donor-payments.controller';
import { DonorPaymentsService } from './donor-payments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonorPayment.name, schema: DonorPaymentSchema },
    ]),
  ],
  controllers: [DonorPaymentsController],
  providers: [DonorPaymentsService],
  exports: [MongooseModule, DonorPaymentsService],
})
export class DonorPaymentsModule {}
