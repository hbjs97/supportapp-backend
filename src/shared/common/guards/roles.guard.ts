import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { isEmpty } from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // Method Roles
    ]);
    if (!roles) return false;

    if (isEmpty(roles)) {
      return true;
    }

    const request: Request = this.getRequest(context);

    const { user } = request;
    if (!user) return false;

    return roles.includes(user.role);
  }

  public getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }
}
