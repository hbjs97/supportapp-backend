import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export function AuthGuard(options?: Partial<{ public: boolean }>): Type<IAuthGuard> {
  const strategies = ['jwt', 'jwt-refresh'];

  if (options?.public) {
    strategies.push('isPublic');
  }

  return NestAuthGuard(strategies);
}
