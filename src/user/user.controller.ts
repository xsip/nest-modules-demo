import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseAuth, BaseUser } from 'nest-modules';
import { Document } from 'mongoose';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  @UseGuards(BaseAuth.JwtAuthGuard)
  @BaseAuth.RoleGuard(BaseUser.BaseUserRole.ADMIN)
  @ApiResponse({
    status: 201,
    type: [UserModel],
    description: 'Gets all Users',
  })
  private async getAllUsers(@BaseAuth.AuthUser() user: UserModel) {
    return this.userService.userModel.find().exec();
  }

  @Post('/create')
  @UseGuards(BaseAuth.JwtAuthGuard)
  @BaseAuth.RoleGuard(BaseUser.BaseUserRole.ADMIN)
  public async createUser(
    @BaseAuth.AuthUser() authUser: UserModel & Document,
    @Body() user: UserModel,
  ) {
    return this.userService.createUser(user);
  }

  @Put('/update')
  @UseGuards(BaseAuth.JwtAuthGuard)
  @BaseAuth.RoleGuard(BaseUser.BaseUserRole.ADMIN)
  public async updateUser(
    @BaseAuth.AuthUser() authUser: UserModel & Document,
    @Body() user: UserModel,
  ) {
    delete user.password;
    delete user.email;
    delete user.role;
    return await this.userService.userModel
      .findOneAndUpdate({ _id: authUser._id }, user)
      .exec();
  }
}
