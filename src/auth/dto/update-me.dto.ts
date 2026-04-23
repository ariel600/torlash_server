import { Type } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class PageAccessDto {
  @IsOptional()
  @IsBoolean()
  StudentsManagement?: boolean;

  @IsOptional()
  @IsBoolean()
  DonorsManagement?: boolean;

  @IsOptional()
  @IsBoolean()
  StandingOrders?: boolean;

  @IsOptional()
  @IsBoolean()
  NedarimPlusSettings?: boolean;

  @IsOptional()
  @IsBoolean()
  FeatureRequests?: boolean;

  @IsOptional()
  @IsBoolean()
  SupervisorView?: boolean;
}

export class UpdateMeDto {
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  homePage?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PageAccessDto)
  pageAccess?: PageAccessDto;
}
