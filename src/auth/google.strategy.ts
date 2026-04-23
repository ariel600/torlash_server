import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    // חייב להתאים *בדיוק* ל־"Authorized redirect URI" ב־Google Cloud (למשל http://localhost:3000/api/auth/google/callback)
    const callbackURL = config.getOrThrow<string>('GOOGLE_CALLBACK_URL');
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const user = await this.authService.findAuthorizedByGoogleProfile(profile);
      const email = profile.emails?.[0]?.value?.trim().toLowerCase() || '';
      if (!user) {
        // ללא JWT — ‎`GoogleCallbackAuthGuard.handleRequest` יזרוק ‎`NotOnWhitelistException` (redirect)
        done(null, false, { reason: 'not_on_whitelist', email });
        return;
      }
      done(null, user);
    } catch (err) {
      done(err as Error, false);
    }
  }
}
