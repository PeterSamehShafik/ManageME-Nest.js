import { IsEmail, IsString } from 'class-validator';

export class loginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  password: string;
}
