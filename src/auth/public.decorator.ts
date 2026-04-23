import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** מעביר נתיבים מחוץ ל־JwtAuthGuard (למשל OAuth, לוגאאוט) */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
