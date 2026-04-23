import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** ‎@Roles('admin') — ביחד עם ‎`RolesGuard` (אחרי ‎`JwtAuthGuard`) */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
