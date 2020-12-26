import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseAuth } from 'nest-modules';

// @ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(BaseAuth.JwtAuthGuard)
  @Get('/all')
  @ApiResponse({
    status: 201,
    type: [UserModel],
    description: 'Gets all Users',
  })
  private async getAllUsers() {
    return await this.userService.userModel.find().exec();
  }

  @ApiBearerAuth()
  @Post('/create')
  public async createUser(@Body() user: UserModel) {
    return this.userService.createUser(user);
  }
}
