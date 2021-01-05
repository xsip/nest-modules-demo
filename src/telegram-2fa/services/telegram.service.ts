import { Injectable } from '@nestjs/common';
import { Telegram2faConfig, TfaConfigToken } from '../telegram-2fa.module';
import { ModuleRef } from '@nestjs/core';
import { UserService } from '../../user/user.service';

interface BotMessage {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    username: string;
    type: string;
  };
  date: string;
  text: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const apiPackage = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private teleApi: typeof apiPackage = undefined;
  private config: Telegram2faConfig;
  constructor(private moduleRef: ModuleRef, private userService: UserService) {
    this.config = moduleRef.get(TfaConfigToken);
    if (!this.teleApi) {
      this.teleApi = new apiPackage(this.config.apiKey, {
        polling: true,
      });
    }
    this.startListening();
  }

  public async sendTfaCodeToUser(chatId: number, code: number) {
    console.log(`Sending ${code} to ${chatId}`);
    await this.sendMessage(`Your 2FA Code is:\n<b>${code}</b>`, true, chatId);
  }

  private async sendMessage(msg: string, html = false, chatId: number) {
    let resp: any = undefined;
    const form: any = {};
    if (!html) {
      resp = this.teleApi.sendMessage(chatId, msg);
    } else {
      form.chat_id = chatId;
      form.text = msg;
      form.parse_mode = 'HTML';
      resp = this.teleApi._request('sendMessage', { form });
    }
    await resp;
  }

  private startListening(): void {
    console.log('[telegram-2fa] - bot listening..');
    this.teleApi.on('message', async (msg: BotMessage) => {
      const pin = parseInt(msg.text, 0);
      if (pin) {
        const activationUser = await this.userService.findOne({
          twoFactorActivationCode: pin,
        });
        if (activationUser) {
          activationUser.telegramData = msg.from;
          activationUser.tfa = true;
          activationUser.twoFactorActivationCode = null;
          await activationUser.save();
          console.log('received activation pin for ' + activationUser.email);
          await this.sendMessage(
            'Thanks for sending your activation pin',
            true,
            msg.from.id,
          );
        }
      }
    });
  }
}
