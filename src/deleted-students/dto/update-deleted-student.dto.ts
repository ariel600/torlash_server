import { PartialType } from '@nestjs/mapped-types';
import { CreateDeletedStudentRecordDto } from './create-deleted-student.dto';

export class UpdateDeletedStudentRecordDto extends PartialType(
  CreateDeletedStudentRecordDto,
) {}
