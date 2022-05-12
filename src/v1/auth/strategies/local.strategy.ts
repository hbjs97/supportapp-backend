import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserLoginPayload } from 'src/v1/auth';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private auth: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string): Promise<UserLoginPayload> {
    const user = await this.auth.validateUser({ email, password });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
