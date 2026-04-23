import { IsIn, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { DonorPaymentStatusEnum } from '../../schemas/donor-payment.schema';

export class CreateDonorPaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  created_by?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  donorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  donorName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  paymentDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  transactionId?: string;

  @IsOptional()
  @IsIn([...DonorPaymentStatusEnum])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsOptional()
  @IsObject()
  nedarimPlusData?: Record<string, unknown>;
}
