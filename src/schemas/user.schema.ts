import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export const UserRoleEnum = ['admin', 'user'] as const;

export const UserTypeEnum = [
  'מנהל',
  'מזכיר',
  'משגיח',
  'מתרים',
  'מפתח',
] as const;

@Schema({ collection: 'users', timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } })
export class User {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String })
  created_by?: string;

  @Prop({ type: String })
  email?: string;

  /** מזהה Google (sub / profile id) — לא חובה למשתמשים ישנים */
  @Prop({ type: String })
  googleId?: string;

  @Prop({ type: String })
  full_name?: string;

  @Prop({ type: String, enum: UserRoleEnum })
  role?: string;

  @Prop({ type: String, enum: UserTypeEnum })
  userType?: string;

  @Prop({ type: String })
  displayName?: string;

  @Prop({ type: String })
  homePage?: string;

  @Prop({
    type: Object,
    default: {},
  })
  pageAccess?: {
    StudentsManagement?: boolean;
    DonorsManagement?: boolean;
    StandingOrders?: boolean;
    NedarimPlusSettings?: boolean;
    FeatureRequests?: boolean;
    SupervisorView?: boolean;
  };

  @Prop({ type: Boolean, default: false })
  isSuperAdmin?: boolean;

  /** false = גישה מושהית (המשתמש ב־DB אך לא אמור להתחבר / לא מקבל אישור) */
  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  /** העדפות (למשל studentsPerPage) – כפי שב־`auth.updateMe` ב-Frontend */
  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  settings?: Record<string, unknown>;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
