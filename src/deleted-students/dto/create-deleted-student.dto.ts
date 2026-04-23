import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeletedStudentRecordDto {
  @IsObject()
  originalStudentData!: Record<string, unknown>;

  @IsString()
  @MaxLength(64)
  deletedAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  deletedBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  originalId?: string;
}
