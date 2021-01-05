import { Injectable } from '@nestjs/common';
import { Telegram2faConfig, TfaConfigToken } from '../telegram-2fa.module';
import { UserService } from '../../user/user.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class PinCreatorService {
  private config: Telegram2faConfig;

  constructor(private moduleRef: ModuleRef, private userService: UserService) {
    this.config = moduleRef.get(TfaConfigToken);
  }

  async addActivationCodeToUser(userId: number) {
    await this.userService.userModel.findByIdAndUpdate(userId, {
      twoFactorActivationCode:
        Math.floor(Math.random() * 909000) + this.config.activationKeyDigits,
    });
  }

  async add2FaCodeToUser(userId: number, tfaCode: number) {
    await this.userService.userModel.findByIdAndUpdate(userId, {
      twoFactorCode: tfaCode,
    });
  }

  createTfaCode() {
    return Math.floor(Math.random() * 909000) + this.config.tfaKeyDigits;
  }
}
