import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryListDto } from '../common/dto/query-list.dto';
import { MongoEntityService } from '../common/mongo-entity.service';
import { NedarimPlusSettings, NedarimPlusSettingsDocument } from '../schemas/nedarim-plus-settings.schema';

@Injectable()
export class NedarimPlusSettingsService {
  private readonly store: MongoEntityService;

  constructor(
    @InjectModel(NedarimPlusSettings.name) model: Model<NedarimPlusSettingsDocument>,
  ) {
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
