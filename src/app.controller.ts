import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseAuth } from 'nest-modules';

class LoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
@ApiTags('App')
@Controller('app')
export class AppController {
  constructor(private authService: BaseAuth.BaseAuthService) {}

  @Post('/login')
  public async login(@Body() user: LoginDto) {
    try {
      const res = await this.authService.validateUser(
        user.email,
        user.password,
      );
      if (res) {
        console.log(res);
        return this.authService.login(res);
      }

      return null;
    } catch (e) {
      return e;
    }
  }
}
