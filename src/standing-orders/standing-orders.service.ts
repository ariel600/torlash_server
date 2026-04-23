import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryListDto } from '../common/dto/query-list.dto';
import { MongoEntityService } from '../common/mongo-entity.service';
import { StandingOrder, StandingOrderDocument } from '../schemas/standing-order.schema';

@Injectable()
export class StandingOrdersService {
  private readonly store: MongoEntityService;

  constructor(@InjectModel(StandingOrder.name) model: Model<StandingOrderDocument>) {
    this.store = new MongoEntityService(model);
  }

  findAll(query: QueryListDto) {
    return this.store.findAll(query);
  }

  findOne(id: string) {
    return this.store.findOne(id);
  }

  create(body: Record<string, unknown>) {
    return this.store.create(body);
  }

  update(id: string, body: Record<string, unknown>) {
    return this.store.update(id, body);
  }

  remove(id: string) {
    return this.store.remove(id);
  }
}
