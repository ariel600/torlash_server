import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'standing_orders', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class StandingOrder {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String })
  created_by?: string;

  @Prop({ type: String })
  studentId?: string;

  @Prop({ type: String })
  studentName?: string;

  @Prop({ type: String })
  paymentBy?: string;

  @Prop({ type: Number })
  amount?: number;

  @Prop({ type: String })
  paymentMethod?: string;

  @Prop({ type: Number, default: 0 })
  debts?: number;

  @Prop({ type: String })
  needsAttention?: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: String })
  nedarimPlusCustomerId?: string;

  @Prop({ type: String })
  nedarimPlusUrl?: string;
}

export type StandingOrderDocument = HydratedDocument<StandingOrder>;
export const StandingOrderSchema = SchemaFactory.createForClass(StandingOrder);
