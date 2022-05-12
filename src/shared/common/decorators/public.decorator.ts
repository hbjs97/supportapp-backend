import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Public = (isPublic = false): CustomDecorator => SetMetadata('isPublic', isPublic);
