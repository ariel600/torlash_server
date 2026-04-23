import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { GoogleCallbackAuthGuard } from './google-callback-auth.guard';
import { Public } from './public.decorator';
import { UserDocument } from '../schemas/user.schema';
import { UpdateMeDto } from './dto/update-me.dto';
import { sendHtmlClientRedirect } from './html-client-redirect';
import { getFrontendBaseUrl } from '../config/frontend-url';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  /** GET /api/auth/google — אימות Google (הפניה ל־Google) */
  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {
    // Passport מבצע הפניה ל-Google
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleCallbackAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserDocument;
    const token = this.authService.signToken(user);
    const fe = getFrontendBaseUrl(this.config);
    const redirectUrl = `${fe}/auth-success?token=${encodeURIComponent(token)}`;
    return res.redirect(302, redirectUrl);
  }

  /**
   * אחרי כשלון Passport ב-callback: הפניה ל-פרונט דרך ‎`window.location` ולא 302
   * (יישור לסוג תגובה כמו ‎`google/callback` בהצלחה).
   * ‎`GET /api/auth/redirect-bridge?e=oauth_failed`
   */
  @Get('redirect-bridge')
  @Public()
  redirectBridge(@Res() res: Response) {
    const fe = getFrontendBaseUrl(this.config);
    const url = new URL(`${fe}/access-denied`);
    url.searchParams.set('error', 'oauth_failed');
    return sendHtmlClientRedirect(res, url.toString());
  }

  @Post('logout')
  @Public()
  logout(@Res() res: Response) {
    return res.json({ ok: true });
  }

  @Get('me')
  me(@Req() req: Request) {
    const u = req.user as UserDocument;
    return this.authService.toPublicUser(u);
  }

  @Patch('me')
  updateMe(@Req() req: Request, @Body() dto: UpdateMeDto) {
    const u = req.user as UserDocument;
    const id = (u as UserDocument & { _id: { toString: () => string } })._id.toString();
    return this.authService.updateMe(id, dto);
  }
}
