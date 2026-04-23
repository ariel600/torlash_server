import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'deleted_students', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class DeletedStudentRecord {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  originalStudentData!: unknown;

  @Prop({ type: String, required: true })
  deletedAt!: string;

  @Prop({ type: String })
  deletedBy?: string;

  @Prop({ type: String })
  reason?: string;

  @Prop({ type: String })
  originalId?: string;
}

export type DeletedStudentRecordDocument = HydratedDocument<DeletedStudentRecord>;
export const DeletedStudentRecordSchema = SchemaFactory.createForClass(DeletedStudentRecord);
