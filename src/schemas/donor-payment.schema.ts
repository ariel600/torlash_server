import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export const DonorPaymentStatusEnum = [
  'בתהליך',
  'אושר',
  'נכשל',
  'בוטל',
] as const;

@Schema({ collection: 'donor_payments', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class DonorPayment {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String })
  created_by?: string;

  @Prop({ type: String })
  donorId?: string;

  @Prop({ type: String })
  donorName?: string;

  @Prop({ type: Number })
  amount?: number;

  @Prop({ type: String })
  paymentDate?: string;

  @Prop({ type: String })
  transactionId?: string;

  @Prop({ type: String, enum: DonorPaymentStatusEnum })
  status?: string;

  @Prop({ type: String })
  paymentMethod?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  nedarimPlusData?: Record<string, unknown>;
}

export type DonorPaymentDocument = HydratedDocument<DonorPayment>;
export const DonorPaymentSchema = SchemaFactory.createForClass(DonorPayment);
