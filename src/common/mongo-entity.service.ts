import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueryListDto } from './dto/query-list.dto';
import { buildSafeSort, stripMongoOperators } from './security/mongo-sanitize.util';

/**
 * CRUD גנרי מול Mongoose — אותו מבנה ל־students, donors, וכו׳
 */
export class MongoEntityService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly model: Model<any>) {}

  async findAll(query: QueryListDto) {
    const filter = this.parseQ(query.q);
    const sort = buildSafeSort(query.sort);
    const qb = this.model.find(filter as never).sort(sort);
    if (query.skip != null) {
      qb.skip(query.skip);
    }
    if (query.limit != null) {
      qb.limit(query.limit);
    }
    if (query.fields?.trim()) {
      const selection = query.fields
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean)
        .join(' ');
      qb.select(selection);
    }
    const docs = await qb.lean().exec();
    return (docs as Record<string, unknown>[]).map((d) => this.serialize(d));
  }

  async findOne(id: string) {
    this.assertObjectId(id);
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) {
      throw new NotFoundException();
    }
    return this.serialize(doc as Record<string, unknown>);
  }

  async create(body: Record<string, unknown>) {
    const created = new this.model(body);
    const saved = await (created as { save: () => Promise<unknown> }).save();
    const o =
      typeof (saved as { toObject?: () => Record<string, unknown> }).toObject === 'function'
        ? (saved as { toObject: () => Record<string, unknown> }).toObject()
        : (saved as Record<string, unknown>);
    return this.serialize(o);
  }

  async update(id: string, body: Record<string, unknown>) {
    this.assertObjectId(id);
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException();
    }
    return this.serialize(updated as Record<string, unknown>);
  }

  async remove(id: string) {
    this.assertObjectId(id);
    const res = await this.model.findByIdAndDelete(id).lean().exec();
    if (!res) {
      throw new NotFoundException();
    }
    return this.serialize(res as Record<string, unknown>);
  }

  private assertObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
  }

  private parseQ(q?: string): Record<string, unknown> {
    if (q == null || q === '') {
      return {};
    }
    try {
      const raw = JSON.parse(q) as Record<string, unknown>;
      return stripMongoOperators(raw) as Record<string, unknown>;
    } catch {
      throw new BadRequestException('Parameter q must be valid JSON');
    }
  }

  private serialize(doc: Record<string, unknown>) {
    const { _id, __v, ...rest } = doc;
    const out: Record<string, unknown> = {
      id: _id != null ? String(_id) : undefined,
      ...rest,
    };
    for (const key of [
      'password',
      'clientSecret',
      'accessToken',
      'refreshToken',
    ] as const) {
      if (key in out) {
        delete out[key];
      }
    }
    return out;
  }
}
