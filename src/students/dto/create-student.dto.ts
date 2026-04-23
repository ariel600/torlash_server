import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AddressDto {
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() buildingNumber?: string;
  @IsOptional() @IsString() entrance?: string;
  @IsOptional() @IsString() apartment?: string;
  @IsOptional() @IsString() floor?: string;
}

class ParentInfoDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() phonePrimary?: string;
  @IsOptional() @IsString() phoneSecondary?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @ValidateNested() @Type(() => AddressDto) address?: AddressDto;
}

class FamilyDetailsDto {
  @IsOptional() @ValidateNested() @Type(() => ParentInfoDto) father?: ParentInfoDto;
  @IsOptional() @ValidateNested() @Type(() => ParentInfoDto) mother?: ParentInfoDto;
}

export class CreateStudentDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() created_by?: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() nickname?: string;
  @IsOptional() @IsString() idNumber?: string;
  @IsOptional() @IsString() birthDate?: string;
  @IsOptional() @IsString() birthDateHebrew?: string;
  @IsOptional() @IsString() phonePrimary?: string;
  @IsOptional() @IsString() phoneSecondary?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() militaryStatus?: string;
  @IsOptional() @IsString() previousYeshiva?: string;
  @IsOptional() @IsString() entryDate?: string;
  @IsOptional() @IsString() exitDate?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @ValidateNested() @Type(() => AddressDto) address?: AddressDto;
  @IsOptional() @ValidateNested() @Type(() => FamilyDetailsDto) familyDetails?: FamilyDetailsDto;
}
