import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { LoginDto, RegisterDto } from './user/dto/user.dto';
import { BaseAuth } from 'nest-modules';
import { UserModule } from './user/user.module';
import { UserModel } from './user/models/user.model';
import { PinCreatorService } from './telegram-2fa/services/pin-creator.service';
import { TelegramService } from './telegram-2fa/services/telegram.service';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private authService: BaseAuth.BaseAuthService,
    private pinCreatorService: PinCreatorService,
    private telegramService: TelegramService,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<void> {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    try {
      const user = await this.userService.findByEmail(registerDto.email);
      if (user) {
        errorCode = HttpStatus.CONFLICT;
        throw new HttpException('User Already exists', errorCode);
      }
      const createdUser = await this.userService.createUser(
        (registerDto as unknown) as UserModel,
      );
      await this.pinCreatorService.addActivationCodeToUser(createdUser._id);
    } catch (e) {
      throw new HttpException(e.toString(), errorCode);
    }
  }

  async preLoginUser(user: LoginDto) {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    try {
      console.log(user);
      const res = await this.authService.validateUser(
        user.email,
        user.password,
      );
      console.log(res);
      if (res) {
        const dbUser = await this.userService.findOne({ email: user.email });
        const tfaCode = this.pinCreatorService.createTfaCode();
        await this.pinCreatorService.add2FaCodeToUser(dbUser._id, tfaCode);
        await this.telegramService.sendTfaCodeToUser(
          dbUser.telegramData.id,
          tfaCode,
        );
        return true;
        // return this.authService.login(res);
      }
      errorCode = HttpStatus.NOT_FOUND;
      throw new HttpException('Invalid Credentials', errorCode);
    } catch (e) {
      throw new HttpException(e.toString(), errorCode);
    }
  }

  async tfaLoginCheck(tfaCode: number) {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const user = await this.userService.findOne({ twoFactorCode: tfaCode });
    if (!user) {
      errorCode = HttpStatus.NOT_FOUND;
      throw new HttpException('Invalid Credentials', errorCode);
    } else return this.authService.login(user);
  }
}
