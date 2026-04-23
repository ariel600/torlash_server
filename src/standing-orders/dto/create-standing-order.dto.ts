import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateStandingOrderDto {
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
  studentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  studentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  paymentBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  paymentMethod?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  debts?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  needsAttention?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nedarimPlusCustomerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  nedarimPlusUrl?: string;
}
