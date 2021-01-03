import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseAuth } from 'nest-modules';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { LobbyModule } from './lobby/lobby.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/leanpass'),
    UserModule,
    LobbyModule,
    BaseAuth.BaseAuthModule.register(
      UserService,
      UserModule,
      'secret',
      false,
      '10h',
    ),
  ],
  controllers: [AppController],
  exports: [MongooseModule],
})
export class AppModule {}
