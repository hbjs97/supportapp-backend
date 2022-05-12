import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { Role } from 'src/shared/common/constants';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'isPublic') {
  override authenticate(): void {
    return this.success({
      [Symbol.for('isPublic')]: true,
      id: '',
      name: '',
      email: '',
      role: Role.UNAUTHORIZED,
    });
  }
}
