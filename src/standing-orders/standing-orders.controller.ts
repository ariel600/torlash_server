import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { QueryListDto } from '../common/dto/query-list.dto';
import { CreateStandingOrderDto } from './dto/create-standing-order.dto';
import { UpdateStandingOrderDto } from './dto/update-standing-order.dto';
import { StandingOrdersService } from './standing-orders.service';

@Controller('standing-orders')
export class StandingOrdersController {
  constructor(private readonly standingOrdersService: StandingOrdersService) {}

  @Get()
  findAll(@Query() query: QueryListDto) {
    return this.standingOrdersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.standingOrdersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateStandingOrderDto) {
    return this.standingOrdersService.create(dto as unknown as Record<string, unknown>);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStandingOrderDto) {
    return this.standingOrdersService.update(id, dto as unknown as Record<string, unknown>);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.standingOrdersService.remove(id);
  }
}
