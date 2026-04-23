import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Address {
  @Prop({ type: String })
  city?: string;

  @Prop({ type: String })
  street?: string;

  @Prop({ type: String })
  buildingNumber?: string;

  @Prop({ type: String })
  entrance?: string;

  @Prop({ type: String })
  apartment?: string;

  @Prop({ type: String })
  floor?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
