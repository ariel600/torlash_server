import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ParentInfo, ParentInfoSchema } from './parent-info.schema';

@Schema({ _id: false })
export class FamilyDetails {
  @Prop({ type: ParentInfoSchema, required: false })
  father?: ParentInfo;

  @Prop({ type: ParentInfoSchema, required: false })
  mother?: ParentInfo;
}

export const FamilyDetailsSchema = SchemaFactory.createForClass(FamilyDetails);
