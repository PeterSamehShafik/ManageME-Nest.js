import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { signupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dtos/login.dto';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async signup(body: signupDto): Promise<UserDto | null> {
    const { name, email, password } = body;

    const exist = await this.userService.findByEmail(email);
    if (exist) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async validateUser(body: loginDto): Promise<UserDto | null> {
    const { email, password } = body;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');    
    return bcrypt.hash(password, Number(saltRounds));
  }
}
