import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { LoginDto, RegisterDto } from './user/dto/user.dto';
import { BaseAuth } from 'nest-modules';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private authService: BaseAuth.BaseAuthService,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<void> {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    try {
      const user = await this.userService.findByEmail(registerDto.email);
      if (user) {
        errorCode = HttpStatus.CONFLICT;
        throw new HttpException('User Already exists', errorCode);
      }
      await this.userService.createUser(registerDto);
    } catch (e) {
      throw new HttpException(e.toString(), errorCode);
    }
  }

  async loginUser(user: LoginDto) {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    try {
      const res = await this.authService.validateUser(
        user.email,
        user.password,
      );
      if (res) {
        return this.authService.login(res);
      }
      errorCode = HttpStatus.NOT_FOUND;
      throw new HttpException('Invalid Credentials', errorCode);
    } catch (e) {
      throw new HttpException(e.toString(), errorCode);
    }
  }
}
