import { IsBoolean, IsEmail, IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserTypeEnum } from '../../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  homePage?: string;

  @IsOptional()
  @IsIn([...UserTypeEnum])
  userType?: (typeof UserTypeEnum)[number];

  @IsOptional()
  @IsObject()
  pageAccess?: Record<string, boolean>;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSuperAdmin?: boolean;
}
