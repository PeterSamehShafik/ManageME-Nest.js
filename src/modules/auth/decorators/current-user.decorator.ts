import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'src/modules/user/dtos/user.dto';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.currentUser;
  },
);
