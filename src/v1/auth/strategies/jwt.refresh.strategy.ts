import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, JwtRefreshPayload } from 'src/v1/auth/types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwtRefreshSecret'),
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: JwtPayload): Promise<JwtRefreshPayload> {
    const refreshToken = req.headers.authorization?.replace('Bearer', '').trim();
    return {
      ...payload,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      refreshToken: refreshToken!,
    };
  }
}
