import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function ReqUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const { user } = request;

    if (user?.[Symbol.for('isPublic')]) {
      return;
    }

    return user;
  })();
}
