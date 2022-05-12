import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { UserEntity } from 'src/shared/entities/user.entity';

import { ContextProvider } from '../providers';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const user = <UserEntity>request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
