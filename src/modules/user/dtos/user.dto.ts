import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  _id?: any;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Exclude()
  password: string;
}
