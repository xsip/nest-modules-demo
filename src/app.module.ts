import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseAuth } from 'nest-modules';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  ],
  controllers: [AppController],
  exports: [MongooseModule],
  providers: [AppService],
})
export class AppModule {}
