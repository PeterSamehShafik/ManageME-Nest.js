import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { signupDto } from 'src/modules/auth/dtos/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  //CRUD
  createUser(user: signupDto): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  //findings...
  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  findById(id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }
}
