import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** לפי מסמך: `דמי לימוד | תורמים` (קטגוריה) */
export const NedarimCategoryEnum = ['דמי לימוד', 'תורמים'] as const;

@Schema({ collection: 'nedarim_plus_settings', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class NedarimPlusSettings {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String })
  created_by?: string;

  @Prop({ type: String, enum: NedarimCategoryEnum, required: true })
  category!: string;

  @Prop({ type: String })
  mosadId?: string;

  @Prop({ type: String })
  apiKey?: string;

  @Prop({ type: String })
  publicKey?: string;

  @Prop({ type: String })
  campaignId?: string;

  @Prop({ type: Boolean, default: false })
  isActive?: boolean;

  @Prop({ type: String })
  notes?: string;
}

export type NedarimPlusSettingsDocument = HydratedDocument<NedarimPlusSettings>;
export const NedarimPlusSettingsSchema = SchemaFactory.createForClass(NedarimPlusSettings);
