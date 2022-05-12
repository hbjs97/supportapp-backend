import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from 'src/shared/common/constants';

export const Roles = (...roles: (Role | 'ALL')[]): CustomDecorator => SetMetadata('roles', roles);
