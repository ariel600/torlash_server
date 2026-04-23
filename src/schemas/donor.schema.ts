import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address, AddressSchema } from './common/address.schema';

export const DonationTypeEnum = [
  'חד פעמי',
  'חודשי',
  'שנתי',
  'לפי אירוע',
] as const;

export const DonorStatusEnum = ['פעיל', 'לא פעיל', 'מושהה'] as const;

@Schema({ collection: 'donors', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class Donor {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String })
  created_by?: string;

  @Prop({ type: String })
  firstName?: string;

  @Prop({ type: String })
  lastName?: string;

  @Prop({ type: String })
  phonePrimary?: string;

  @Prop({ type: String })
  phoneSecondary?: string;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String, enum: DonationTypeEnum })
  donationType?: string;

  @Prop({ type: Number })
  amount?: number;

  @Prop({ type: String })
  paymentMethod?: string;

  @Prop({ type: String, enum: DonorStatusEnum })
  status?: string;

  @Prop({ type: String })
  lastDonationDate?: string;

  @Prop({ type: String })
  nextDonationDate?: string;

  @Prop({ type: Number })
  totalDonated?: number;

  @Prop({ type: String })
  nedarimPlusCustomerId?: string;

  @Prop({ type: String })
  nedarimPlusUrl?: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: AddressSchema, required: false })
  address?: Address;
}

export type DonorDocument = HydratedDocument<Donor>;
export const DonorSchema = SchemaFactory.createForClass(Donor);
