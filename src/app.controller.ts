import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseAuth } from 'nest-modules';
import { AnonymousLoginDto, LoginDto, RegisterDto } from './user/dto/user.dto';
import { UserService } from './user/user.service';
import * as uuid from 'uuid';
import { AppService } from './app.service';

class LoginResponse {
  @ApiProperty()
  access_token: string;
}
@ApiTags('App')
@Controller('app')
export class AppController {
  constructor(
    private authService: BaseAuth.BaseAuthService,
    private userService: UserService,
    private appService: AppService,
  ) {}

  /*@Post('/anonymous-login')
  @ApiResponse({
    status: 201,
    type: LoginResponse,
    description: 'login anonymous',
  })
  public async anonymousLogin(@Body() user: AnonymousLoginDto) {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    try {
      return this.authService.login({ _id: uuid.v4(), name: user.name });
      errorCode = HttpStatus.NOT_FOUND;
      throw new HttpException('Invalid Credentials', errorCode);
    } catch (e) {
      throw new HttpException(e.toString(), errorCode);
    }
  }*/

  @ApiResponse({
    status: 201,
    type: LoginResponse,
    description: 'Login With Backend',
  })
  @Post('/login')
  public async login(@Body() user: LoginDto) {
    console.log(user);
    return await this.appService.loginUser(user);
  }
  @Post('/register')
  public async register(@Body() registerDto: RegisterDto) {
    await this.appService.registerUser(registerDto);
  }
}
