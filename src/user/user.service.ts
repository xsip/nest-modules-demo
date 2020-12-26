import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserModel } from './models/user.model';
import { BaseUser } from 'nest-modules';

@Injectable()
export class UserService extends BaseUser.BaseUserService<UserModel> {
  constructor(
    @InjectModel('user') public userModel: Model<UserModel & Document>,
  ) {
    super(userModel);
  }
}
