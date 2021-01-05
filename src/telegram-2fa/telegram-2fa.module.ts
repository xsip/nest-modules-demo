import { DynamicModule, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TelegramService } from './services/telegram.service';
import { PinCreatorService } from './services/pin-creator.service';

export interface Telegram2faConfig {
  apiKey: string;
  activationKeyDigits: number;
  activationKeyExpiresInMinutes: number;
  tfaKeyDigits: number;
  tfaKeyExpiresInMinutes: number;
}

export const TfaConfigToken = 'TfaConfig';
@Module({})
export class Telegram2faModule {
  static register(
    config: Telegram2faConfig = {
      apiKey: undefined,
      activationKeyDigits: 6,
      activationKeyExpiresInMinutes: 10,
      tfaKeyDigits: 6,
      tfaKeyExpiresInMinutes: 1,
    },
  ): DynamicModule {
    return {
      module: Telegram2faModule,
      providers: [
        TelegramService,
        PinCreatorService,
        { provide: TfaConfigToken, useValue: config },
      ],
      imports: [UserModule],
      exports: [UserModule, TelegramService, PinCreatorService],
    };
  }
}
