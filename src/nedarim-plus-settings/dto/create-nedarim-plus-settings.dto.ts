import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { NedarimCategoryEnum } from '../../schemas/nedarim-plus-settings.schema';

export class CreateNedarimPlusSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  created_by?: string;

  @IsIn([...NedarimCategoryEnum])
  category!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  mosadId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  apiKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  publicKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  campaignId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string;
}
