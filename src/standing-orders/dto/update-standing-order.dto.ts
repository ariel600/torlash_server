import { PartialType } from '@nestjs/mapped-types';
import { CreateStandingOrderDto } from './create-standing-order.dto';

export class UpdateStandingOrderDto extends PartialType(CreateStandingOrderDto) {}
