import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../user/entity/user.entity';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
