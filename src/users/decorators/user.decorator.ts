import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from './user.type';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserEntity;
  },
);
