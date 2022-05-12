import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserLoginPayload } from './types';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  public serializeUser(user: UserLoginPayload, done: (err: Error | null, data?: UserLoginPayload) => void): void {
    done(null, user);
  }

  public deserializeUser(data: UserLoginPayload, done: (err: Error | null, user?: UserLoginPayload) => void): void {
    try {
      done(null, data);
    } catch (err) {
      done(<Error>err);
    }
  }
}
