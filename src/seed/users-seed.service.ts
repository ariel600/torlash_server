import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

type RawSeed = Record<string, unknown> & {
  email?: string;
  userEmail?: string;
  userName?: string;
  full_name?: string;
  displayName?: string;
  homePage?: string;
  userType?: string;
  role?: string;
  pageAccess?: Record<string, boolean>;
  isSuperAdmin?: boolean;
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canExport?: boolean;
  };
};

const DEFAULT_PAGE_ACCESS_ADMIN: NonNullable<User['pageAccess']> = {
  StudentsManagement: true,
  DonorsManagement: true,
  StandingOrders: true,
  NedarimPlusSettings: true,
  FeatureRequests: true,
  SupervisorView: true,
};

@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
  private readonly log = new Logger(UsersSeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  private resolveSeedPaths(): string[] {
    const out: string[] = [];
    const explicit = this.config.get<string>('AUTHORIZED_USERS_SEED_PATH', '');
    if (explicit && existsSync(explicit)) {
      out.push(explicit);
    }
    const cwd = process.cwd();
    const candidates: [string, string][] = [
      [join(cwd, 'client', 'seed-entities', 'entities', 'authorized-users.seed.json'), 'authorized-users'],
      [join(cwd, '..', 'client', 'seed-entities', 'entities', 'authorized-users.seed.json'), 'authorized-users'],
      [join(cwd, 'client', 'seed-entities', 'entities', 'UserPermissions.data.json'), 'UserPermissions.data'],
      [join(cwd, '..', 'client', 'seed-entities', 'entities', 'UserPermissions.data.json'), 'UserPermissions.data'],
    ];
    for (const [p, _label] of candidates) {
      if (existsSync(p) && !out.includes(p)) {
        out.push(p);
      }
    }
    return out;
  }

  private defaultPageAccessForRole(role: string | undefined): User['pageAccess'] {
    if (role === 'admin') {
      return { ...DEFAULT_PAGE_ACCESS_ADMIN };
    }
    return { StudentsManagement: true, SubmitFeatureRequest: true } as User['pageAccess'];
  }

  private normalizeRow(raw: RawSeed): Partial<User> | null {
    const email = String(raw.email || raw.userEmail || '')
      .trim()
      .toLowerCase();
    if (!email || email.startsWith('change_me')) {
      return null;
    }
    const name = (raw.userName as string) || (raw.full_name as string) || (raw.displayName as string) || email;
    const role = (raw.role as 'admin' | 'user') || 'user';
    const hasPage = raw.pageAccess && Object.keys(raw.pageAccess).length > 0;
    return {
      email,
      role,
      userType: (raw.userType as User['userType']) || (role === 'admin' ? 'מנהל' : 'מזכיר'),
      full_name: (raw.full_name as string) || name,
      displayName: (raw.displayName as string) || name,
      homePage: (raw.homePage as string) || (role === 'admin' ? 'StudentsManagement' : 'StudentsManagement'),
      pageAccess: hasPage ? (raw.pageAccess as User['pageAccess']) : this.defaultPageAccessForRole(role),
      isSuperAdmin: (raw.isSuperAdmin as boolean) || false,
      settings: raw.permissions
        ? { userPermissions: raw.permissions as Record<string, unknown> }
        : undefined,
    };
  }

  private loadJsonArray(path: string): unknown[] {
    const text = readFileSync(path, 'utf8');
    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  }

  /**
   * מנהל ראשון מ־.env (לא בקוד / לא ב-git) — ‎`SEED_ADMIN_EMAIL` + ‎`SEED_ADMIN_NAME`
   */
  async upsertAdminFromEnv(): Promise<number> {
    const email = (this.config.get<string>('SEED_ADMIN_EMAIL', '') || '').trim().toLowerCase();
    if (!email) {
      return 0;
    }
    const name = (this.config.get<string>('SEED_ADMIN_NAME', '') || '').trim() || email;
    const role = (this.config.get<string>('SEED_ADMIN_ROLE', 'admin') as 'admin' | 'user') || 'admin';
    const perms: RawSeed['permissions'] = {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
    };
    const doc: Partial<User> = {
      email,
      role,
      userType: 'מנהל',
      full_name: name,
      displayName: name,
      homePage: 'StudentsManagement',
      pageAccess: { ...DEFAULT_PAGE_ACCESS_ADMIN },
      isSuperAdmin: false,
      settings: { userPermissions: perms as Record<string, unknown> },
    };
    this.log.log(`Seeding admin מ־.env: ${email}`);
    await this.userModel.updateOne({ email }, { $set: doc }, { upsert: true });
    return 1;
  }

  async onApplicationBootstrap() {
    const paths = this.resolveSeedPaths();
    if (paths.length === 0) {
      this.log.log('אין קבצי JSON ל-seed; נבדק SEED_* ב-/.env');
    }
    let n = 0;
    for (const path of paths) {
      this.log.log(`מסנכרן משתמשים מ־${path}`);
      let list: unknown[];
      try {
        list = this.loadJsonArray(path);
      } catch (e) {
        this.log.error(`קריאה נכשלה: ${path}`, e);
        continue;
      }
      for (const item of list) {
        const doc = this.normalizeRow(item as RawSeed);
        if (!doc?.email) {
          continue;
        }
        await this.userModel.updateOne(
          { email: doc.email },
          { $set: doc },
          { upsert: true },
        );
        n++;
      }
    }
    const m = await this.upsertAdminFromEnv();
    n += m;
    this.log.log(
      m > 0
        ? `סיום seed: ${n} upsert (כולל admin מ-SEED_*), בנוסף ל-JSON אם הוגדר`
        : `סיום seed: ${n} upsert מ-JSON. להזנת admin: הגדר ‎SEED_ADMIN_EMAIL ב־server/.env (לא ב-git)`,
    );
  }
}
