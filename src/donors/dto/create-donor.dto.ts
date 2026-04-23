import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { DonationTypeEnum, DonorStatusEnum } from '../../schemas/donor.schema';

class AddressInputDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  street?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  buildingNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  entrance?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  apartment?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  floor?: string;
}

export class CreateDonorDto {
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
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phonePrimary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phoneSecondary?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  @IsOptional()
  @IsIn([...DonationTypeEnum])
  donationType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  paymentMethod?: string;

  @IsOptional()
  @IsIn([...DonorStatusEnum])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  lastDonationDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  nextDonationDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDonated?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nedarimPlusCustomerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  nedarimPlusUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressInputDto)
  address?: AddressInputDto;
}
