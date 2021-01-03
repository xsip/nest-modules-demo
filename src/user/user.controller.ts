import {
  applyDecorators,
  Body,
  Controller,
  createParamDecorator,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseAuth, BaseUser } from 'nest-modules';
import { Document } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

/*export const RoleGuard2 = createParamDecorator((data, req) => {
  SetMetadata('role', role);
  return req.args[0].user;
});*/

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
    /*if (user.role === BaseUserRole.ADMIN) {
    }*/
    try {
      return await this.userService.userModel.find().exec();
    } catch (e) {}
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
