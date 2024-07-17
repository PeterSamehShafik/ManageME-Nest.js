import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dtos/signup.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { loginDto } from './dtos/login.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: signupDto): Promise<UserDto> {
    const user = await this.authService.signup(body);
    if (!user) {
      throw new BadRequestException('Failed to register');
    }
    return user;
  }

  @Post('/login')
  async login(
    @Body() body: loginDto,
    @Session() session: any,
  ): Promise<UserDto> {
    const user = await this.authService.validateUser(body);
    session.userId = user._id;
    return user;
  }

  @Get('logout')
  async logout(@Session() session: any) {
    session.userId = null;
  }
}
