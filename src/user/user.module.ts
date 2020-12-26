import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { BaseUser } from 'nest-modules';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [BaseUser.BaseUserModule.register(UserModel)],
  providers: [UserService],
  exports: [BaseUser.BaseUserModule, UserService],
})
export class UserModule {}
