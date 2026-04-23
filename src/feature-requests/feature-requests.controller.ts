import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { QueryListDto } from '../common/dto/query-list.dto';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { UpdateFeatureRequestDto } from './dto/update-feature-request.dto';
import { FeatureRequestsService } from './feature-requests.service';

@Controller('feature-requests')
export class FeatureRequestsController {
  constructor(private readonly featureRequestsService: FeatureRequestsService) {}

  @Get()
  findAll(@Query() query: QueryListDto) {
    return this.featureRequestsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureRequestsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFeatureRequestDto) {
    return this.featureRequestsService.create(dto as unknown as Record<string, unknown>);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeatureRequestDto) {
    return this.featureRequestsService.update(id, dto as unknown as Record<string, unknown>);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featureRequestsService.remove(id);
  }
}
