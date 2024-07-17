import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  myProfile(@CurrentUser() user: UserDto) {
    return user;
  }
}
