import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const FeatureRequestStatusEnum = [
  'ממתין לבדיקה',
  'בטיפול',
  'הושלם',
  'נדחה',
] as const;

@Schema({ collection: 'feature_requests', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class FeatureRequest {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String })
  created_by?: string;

  @Prop({ type: String })
  title?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  location?: string;

  @Prop({ type: String, enum: FeatureRequestStatusEnum })
  status?: string;

  @Prop({ type: String })
  submittedBy?: string;

  @Prop({ type: String })
  submittedByEmail?: string;

  @Prop({ type: String })
  adminNotes?: string;
}

export type FeatureRequestDocument = HydratedDocument<FeatureRequest>;
export const FeatureRequestSchema = SchemaFactory.createForClass(FeatureRequest);
