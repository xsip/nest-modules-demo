import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(BaseAuth.JwtAuthGuard)
  @Get('/all')
  @ApiResponse({
    status: 201,
    type: [UserModel],
    description: 'Gets all Users',
  })
  private async getAllUsers(@BaseAuth.AuthUser() user: UserModel) {
    return await this.userService.userModel.find().exec();
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @Post('/create')
  public async createUser(
    @BaseAuth.AuthUser() authUser: UserModel & Document,
    @Body() user: UserModel,
  ) {
    if (authUser.role === BaseUser.BaseUserRole.ADMIN) {
      return this.userService.createUser(user);
    }
    throw new HttpException(
      'Only admins can register users',
      HttpStatus.UNAUTHORIZED,
    );
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @Put('/update')
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
