import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { QueryListDto } from '../common/dto/query-list.dto';
import { CreateDonorPaymentDto } from './dto/create-donor-payment.dto';
import { UpdateDonorPaymentDto } from './dto/update-donor-payment.dto';
import { DonorPaymentsService } from './donor-payments.service';

@Controller('donor-payments')
export class DonorPaymentsController {
  constructor(private readonly donorPaymentsService: DonorPaymentsService) {}

  @Get()
  findAll(@Query() query: QueryListDto) {
    return this.donorPaymentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donorPaymentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDonorPaymentDto) {
    return this.donorPaymentsService.create(dto as unknown as Record<string, unknown>);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDonorPaymentDto) {
    return this.donorPaymentsService.update(id, dto as unknown as Record<string, unknown>);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donorPaymentsService.remove(id);
  }
}
