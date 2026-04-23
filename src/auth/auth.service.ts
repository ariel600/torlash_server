import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'passport-google-oauth20';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateMeDto } from './dto/update-me.dto';

export type PublicUser = Record<string, unknown> & { id: string; email?: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Google OAuth: רק משתמשים ב־Mongo (אחרי seed מ־authorized-users.seed.json).
   * קובץ ‎`UserPermissions` בתיקיית ‎`seed-entities` הוא סכימה; הרשימה היא ה־seed/DB, לא jsonc בזמן callback.
   */
  async findAuthorizedByGoogleProfile(profile: Profile): Promise<UserDocument | null> {
    const email = profile.emails?.[0]?.value?.trim().toLowerCase();
    if (!email) {
      return null;
    }
    const googleId = profile.id;
    const existing = await this.userModel.findOne({ email }).exec();
    if (!existing) {
      return null;
    }
    if (existing.isActive === false) {
      return null;
    }
    if (googleId && !existing.googleId) {
      existing.googleId = googleId;
      await existing.save();
    }
    return existing;
  }

  signToken(user: UserDocument): string {
    const sub = (user as UserDocument & { _id: { toString: () => string } })._id.toString();
    const email = user.email;
    return this.jwtService.sign({ sub, email });
  }

  toPublicUser(doc: UserDocument | null | undefined): PublicUser | null {
    if (!doc) {
      return null;
    }
    const o =
      typeof (doc as UserDocument & { toObject?: () => Record<string, unknown> }).toObject ===
      'function'
        ? (doc as UserDocument & { toObject: () => Record<string, unknown> }).toObject()
        : { ...(doc as unknown as Record<string, unknown>) };
    const id = (o as { _id?: { toString: () => string } })._id?.toString() ?? o.id;
    if (!id) {
      return null;
    }
    const raw = o as Record<string, unknown>;
    const pick = [
      'email',
      'full_name',
      'displayName',
      'role',
      'userType',
      'homePage',
      'pageAccess',
      'isActive',
      'isSuperAdmin',
      'settings',
      'created_date',
      'updated_date',
    ] as const;
    const out: Record<string, unknown> = { id };
    for (const k of pick) {
      if (k in raw && raw[k] !== undefined) {
        out[k] = raw[k];
      }
    }
    return out as PublicUser;
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateMe(userId: string, patch: UpdateMeDto): Promise<PublicUser> {
    const $set: Record<string, unknown> = {};
    if (patch.settings !== undefined) {
      $set.settings = patch.settings;
    }
    if (patch.displayName !== undefined) {
      $set.displayName = patch.displayName;
    }
    if (patch.homePage !== undefined) {
      $set.homePage = patch.homePage;
    }
    if (patch.pageAccess !== undefined) {
      $set.pageAccess = patch.pageAccess;
    }
    const u = await this.userModel
      .findByIdAndUpdate(userId, { $set }, { new: true, runValidators: true })
      .exec();
    if (!u) {
      throw new NotFoundException();
    }
    return this.toPublicUser(u)!;
  }

  cookieMaxAgeMs(): number {
    const s = parseInt(
      this.config.get<string>('JWT_EXPIRES_IN', String(60 * 60 * 24 * 7)),
      10,
    );
    return s * 1000;
  }
}
