import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseAuth } from 'nest-modules';
import { LoginDto, RegisterDto } from './user/dto/user.dto';
import { UserService } from './user/user.service';
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

  @ApiResponse({
    status: 201,
    type: LoginResponse,
    description: 'Login With Backend',
  })
  @Post('/login')
  public async login(@Body() user: LoginDto) {
    return await this.appService.loginUser(user);
  }
  @Post('/register')
  public async register(@Body() registerDto: RegisterDto) {
    await this.appService.registerUser(registerDto);
  }
}
