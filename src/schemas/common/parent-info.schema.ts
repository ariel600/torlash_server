import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address, AddressSchema } from './address.schema';

@Schema({ _id: false })
export class ParentInfo {
  @Prop({ type: String })
  firstName?: string;

  @Prop({ type: String })
  phonePrimary?: string;

  @Prop({ type: String })
  phoneSecondary?: string;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: AddressSchema, required: false })
  address?: Address;
}

export const ParentInfoSchema = SchemaFactory.createForClass(ParentInfo);
