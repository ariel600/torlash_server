import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { QueryListDto } from '../common/dto/query-list.dto';
import { CreateNedarimPlusSettingsDto } from './dto/create-nedarim-plus-settings.dto';
import { UpdateNedarimPlusSettingsDto } from './dto/update-nedarim-plus-settings.dto';
import { NedarimPlusSettingsService } from './nedarim-plus-settings.service';

@Controller('nedarim-plus-settings')
export class NedarimPlusSettingsController {
  constructor(private readonly nedarimPlusSettingsService: NedarimPlusSettingsService) {}

  @Get()
  findAll(@Query() query: QueryListDto) {
    return this.nedarimPlusSettingsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nedarimPlusSettingsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNedarimPlusSettingsDto) {
    return this.nedarimPlusSettingsService.create(
      dto as unknown as Record<string, unknown>,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNedarimPlusSettingsDto) {
    return this.nedarimPlusSettingsService.update(
      id,
      dto as unknown as Record<string, unknown>,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nedarimPlusSettingsService.remove(id);
  }
}
