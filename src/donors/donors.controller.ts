import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { QueryListDto } from '../common/dto/query-list.dto';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { DonorsService } from './donors.service';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get()
  findAll(@Query() query: QueryListDto) {
    return this.donorsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donorsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDonorDto) {
    return this.donorsService.create(dto as unknown as Record<string, unknown>);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDonorDto) {
    return this.donorsService.update(id, dto as unknown as Record<string, unknown>);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donorsService.remove(id);
  }
}
