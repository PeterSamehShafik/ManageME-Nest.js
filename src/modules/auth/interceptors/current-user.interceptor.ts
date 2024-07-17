import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserDto } from 'src/modules/user/dtos/user.dto';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UserService) {}

  async intercept(ctx: ExecutionContext, next: CallHandler<any>) {
    const req = ctx.switchToHttp().getRequest();
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findById(userId);
      req.currentUser = user;
    }

    return next.handle();
  }
}
