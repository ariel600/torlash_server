import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from '../schemas/student.schema';
import { buildSafeSort, stripMongoOperators } from '../common/security/mongo-sanitize.util';
import { CreateStudentDto } from './dto/create-student.dto';
import { QueryStudentsDto } from './dto/query-students.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  async findAll(query: QueryStudentsDto) {
    const filter = this.parseQ(query.q);
    const sort = buildSafeSort(query.sort);
    const qb = this.studentModel.find(filter).sort(sort);
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
    return docs.map((d) => this.serialize(d as Record<string, unknown>));
  }

  async findOne(id: string) {
    this.assertObjectId(id);
    const doc = await this.studentModel.findById(id).lean().exec();
    if (!doc) {
      throw new NotFoundException(`Student ${id} not found`);
    }
    return this.serialize(doc as Record<string, unknown>);
  }

  async create(dto: CreateStudentDto) {
    const created = new this.studentModel(dto);
    const saved = await created.save();
    return this.serialize(
      saved.toObject() as unknown as Record<string, unknown>,
    );
  }

  async update(id: string, dto: UpdateStudentDto) {
    this.assertObjectId(id);
    const updated = await this.studentModel
      .findByIdAndUpdate(
        id,
        { $set: dto as Record<string, unknown> },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException(`Student ${id} not found`);
    }
    return this.serialize(updated as Record<string, unknown>);
  }

  async remove(id: string) {
    this.assertObjectId(id);
    const res = await this.studentModel.findByIdAndDelete(id).lean().exec();
    if (!res) {
      throw new NotFoundException(`Student ${id} not found`);
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
    return {
      id: _id != null ? String(_id) : undefined,
      ...rest,
    };
  }
}
