import { PartialType } from '@nestjs/mapped-types';
import { CreateDonorPaymentDto } from './create-donor-payment.dto';

export class UpdateDonorPaymentDto extends PartialType(CreateDonorPaymentDto) {}
