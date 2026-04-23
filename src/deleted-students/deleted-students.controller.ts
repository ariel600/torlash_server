import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { QueryListDto } from '../common/dto/query-list.dto';
import { CreateDeletedStudentRecordDto } from './dto/create-deleted-student.dto';
import { UpdateDeletedStudentRecordDto } from './dto/update-deleted-student.dto';
import { DeletedStudentsService } from './deleted-students.service';

@Controller('deleted-students')
export class DeletedStudentsController {
  constructor(private readonly deletedStudentsService: DeletedStudentsService) {}

  @Get()
  findAll(@Query() query: QueryListDto) {
    return this.deletedStudentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deletedStudentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDeletedStudentRecordDto) {
    return this.deletedStudentsService.create(
      dto as unknown as Record<string, unknown>,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeletedStudentRecordDto) {
    return this.deletedStudentsService.update(
      id,
      dto as unknown as Record<string, unknown>,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deletedStudentsService.remove(id);
  }
}
