import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { FeatureRequestStatusEnum } from '../../schemas/feature-request.schema';

export class CreateFeatureRequestDto {
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
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsIn([...FeatureRequestStatusEnum])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  submittedBy?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  submittedByEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  adminNotes?: string;
}
