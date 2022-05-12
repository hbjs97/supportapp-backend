import { applyDecorators, Param, ParseUUIDPipe, PipeTransform, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import type { Role } from '../constants';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { Public } from './public.decorator';

export function Auth(roles: Role[] = [], options?: Partial<{ public: boolean }>): MethodDecorator {
  const isPublic = options?.public;

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard({ public: isPublic }), RolesGuard),
    ApiBearerAuth('jwt'),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    Public(isPublic),
  );
}

export function UUIDParam(property: string, ...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
