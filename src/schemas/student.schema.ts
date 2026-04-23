import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address, AddressSchema } from './common/address.schema';
import { FamilyDetails, FamilyDetailsSchema } from './common/family-details.schema';

export const StudentStatusEnum = [
  'ללא סטטוס',
  'תלמיד',
  'צוות',
  'בוגר - נשוי',
  'בוגר - רווק',
  'דתות',
] as const;

export const MilitaryStatusEnum = ['דיחוי', 'פטור', 'אחר', 'לא רלוונטי'] as const;

@Schema({ collection: 'students', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class Student {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String })
  created_by?: string;

  @Prop({ type: String })
  firstName?: string;

  @Prop({ type: String })
  lastName?: string;

  @Prop({ type: String })
  nickname?: string;

  @Prop({ type: String })
  idNumber?: string;

  @Prop({ type: String })
  birthDate?: string;

  @Prop({ type: String })
  birthDateHebrew?: string;

  @Prop({ type: String })
  phonePrimary?: string;

  @Prop({ type: String })
  phoneSecondary?: string;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String, enum: StudentStatusEnum })
  status?: string;

  @Prop({ type: String, enum: MilitaryStatusEnum })
  militaryStatus?: string;

  @Prop({ type: String })
  previousYeshiva?: string;

  @Prop({ type: String })
  entryDate?: string;

  @Prop({ type: String })
  exitDate?: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: AddressSchema, required: false })
  address?: Address;

  @Prop({ type: FamilyDetailsSchema, required: false })
  familyDetails?: FamilyDetails;
}

export type StudentDocument = HydratedDocument<Student>;
export const StudentSchema = SchemaFactory.createForClass(Student);
