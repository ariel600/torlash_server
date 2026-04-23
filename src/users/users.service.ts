import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const DEFAULT_PAGE_ACCESS_ADMIN = {
  StudentsManagement: true,
  DonorsManagement: true,
  StandingOrders: true,
  NedarimPlusSettings: true,
  FeatureRequests: true,
  SupervisorView: true,
} satisfies NonNullable<User['pageAccess']>;

function defaultPageAccessForRole(role: 'admin' | 'user'): User['pageAccess'] {
  if (role === 'admin') {
    return { ...DEFAULT_PAGE_ACCESS_ADMIN };
  }
  return { StudentsManagement: true, SubmitFeatureRequest: true } as User['pageAccess'];
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  /** שינוי או עד ‎`isSuperAdmin` — חייב באופן מרכזי סופר־אדמין. */
  private assertActorMayChangeSuperFlag(actor: UserDocument) {
    if (actor.isSuperAdmin !== true) {
      throw new ForbiddenException('רק סופר-אדמין רשאי לניהול סופר-אדמין');
    }
  }

  async findAll() {
    const list = await this.userModel.find().sort({ email: 1 }).exec();
    return list.map((d) => this.authService.toPublicUser(d)!).filter(Boolean);
  }

  async create(dto: CreateUserDto, actor: UserDocument) {
    if (dto.isSuperAdmin === true) {
      this.assertActorMayChangeSuperFlag(actor);
    }
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new BadRequestException('האימייל כבר קיים');
    }
    /** UI לא מבחין יותר ב־user/admin; משתמשים חדשים = ‎`user` */
    const role = 'user' as const;
    const nameFromEmail = email.split('@')[0] || email;
    const full_name = (dto.full_name && dto.full_name.trim()) || nameFromEmail;
    const displayName = (dto.displayName && dto.displayName.trim()) || full_name;
    const userType = dto.userType ?? 'מזכיר';
    const homePage = (dto.homePage && dto.homePage.trim()) || 'StudentsManagement';
    const baseAccess = defaultPageAccessForRole(role);
    const pageAccess =
      dto.pageAccess != null
        ? ({ ...baseAccess, ...dto.pageAccess } as NonNullable<User['pageAccess']>)
        : baseAccess;
    const isActive = dto.isActive !== false;
    const isSuperAdmin = dto.isSuperAdmin === true;

    const user = new this.userModel({
      email,
      role,
      userType,
      full_name,
      displayName,
      homePage,
      pageAccess,
      isActive,
      isSuperAdmin,
    });
    await user.save();
    return this.authService.toPublicUser(user);
  }

  async update(id: string, dto: UpdateUserDto, actor: UserDocument) {
    const u = await this.userModel.findById(id);
    if (!u) {
      throw new NotFoundException();
    }
    const prevRole = u.role as 'admin' | 'user' | undefined;
    if (dto.isSuperAdmin !== undefined) {
      const was = u.isSuperAdmin === true;
      if (dto.isSuperAdmin !== was) {
        this.assertActorMayChangeSuperFlag(actor);
      }
    }

    if (u.role === 'admin' && dto.role === 'user') {
      const c = await this.userModel.countDocuments({ _id: { $ne: u._id }, role: 'admin' });
      if (c < 1) {
        throw new BadRequestException('לא ניתן להסיר את המנהל היחיד במערכת');
      }
    }

    if (dto.email) {
      const e = dto.email.trim().toLowerCase();
      const taken = await this.userModel.findOne({ email: e, _id: { $ne: u._id } });
      if (taken) {
        throw new BadRequestException('האימייל כבר רשום');
      }
      u.email = e;
    }
    if (dto.full_name !== undefined) u.full_name = dto.full_name;
    if (dto.displayName !== undefined) u.displayName = dto.displayName;
    if (dto.homePage !== undefined) u.homePage = dto.homePage;
    if (dto.isActive !== undefined) u.isActive = dto.isActive;
    if (dto.pageAccess !== undefined) u.pageAccess = dto.pageAccess;
    if (dto.isSuperAdmin !== undefined) u.isSuperAdmin = dto.isSuperAdmin;

    if (dto.role !== undefined) {
      u.role = dto.role;
      if (dto.userType !== undefined) {
        u.userType = dto.userType;
      } else {
        u.userType = dto.role === 'admin' ? 'מנהל' : 'מזכיר';
      }
      if (dto.role !== prevRole && dto.pageAccess === undefined) {
        u.pageAccess = defaultPageAccessForRole(dto.role);
      }
    } else if (dto.userType !== undefined) {
      u.userType = dto.userType;
    }

    await u.save();
    return this.authService.toPublicUser(u);
  }

  async remove(id: string, currentUserId: string, actor: UserDocument) {
    const targetId = String(id).trim();
    const selfId = String(currentUserId).trim();
    if (targetId === selfId) {
      throw new BadRequestException(
        'אין למחוק את עצמך (גם אם חשבונך מוגדר כ־admin — מונע נעילה מחוץ למערכת)',
      );
    }
    const doc = await this.userModel.findById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    if (doc.isSuperAdmin === true && actor.isSuperAdmin !== true) {
      throw new ForbiddenException('רק סופר-אדמין יכול למחוק חשבון סופר-אדמין');
    }
    if (doc.role === 'admin') {
      const count = await this.userModel.countDocuments({ role: 'admin' });
      if (count <= 1) {
        throw new BadRequestException('אי אפשר למחוק את המנהל היחיד');
      }
    }
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException();
    }
    return { ok: true };
  }
}
