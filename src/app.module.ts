import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseAuth } from 'nest-modules';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Telegram2faModule } from './telegram-2fa/telegram-2fa.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/leanpass'),
    UserModule,
    BaseAuth.BaseAuthModule.register(
      UserService,
      UserModule,
      'secret',
      true,
      '10h',
    ),
    Telegram2faModule.register({
      apiKey: '1004794030:AAFTup7S8hyGQSHSF5UGTFux3mhp7-pHbCs',
      activationKeyDigits: 6,
      activationKeyExpiresInMinutes: 10,
      tfaKeyDigits: 6,
      tfaKeyExpiresInMinutes: 1,
    }),
  ],
  controllers: [AppController],
  exports: [MongooseModule],
  providers: [AppService],
})
export class AppModule {}
