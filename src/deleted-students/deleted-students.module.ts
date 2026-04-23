import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeletedStudentRecord,
  DeletedStudentRecordSchema,
} from '../schemas/deleted-student.schema';
import { DeletedStudentsController } from './deleted-students.controller';
import { DeletedStudentsService } from './deleted-students.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeletedStudentRecord.name, schema: DeletedStudentRecordSchema },
    ]),
  ],
  controllers: [DeletedStudentsController],
  providers: [DeletedStudentsService],
  exports: [MongooseModule, DeletedStudentsService],
})
export class DeletedStudentsModule {}
