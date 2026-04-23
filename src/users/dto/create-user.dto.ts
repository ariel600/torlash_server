import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { UserTypeEnum } from '../../schemas/user.schema';

/** יצירת משתמש — אותם שדות שמנוהלים ב־PATCH (למעט אימייל כחובה) */
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  /** נשלח בדפדפנים ישנים; בשרת נתעלם — משתמש חדש תמיד ‎`user` */
  role?: 'admin' | 'user';

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsIn([...UserTypeEnum])
  userType?: (typeof UserTypeEnum)[number];

  @IsOptional()
  @IsString()
  homePage?: string;

  @IsOptional()
  @IsObject()
  pageAccess?: Record<string, boolean>;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSuperAdmin?: boolean;
}
