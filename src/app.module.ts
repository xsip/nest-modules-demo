import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseAuth } from 'nest-modules';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/leanpass'),
    UserModule,
    BaseAuth.BaseAuthModule.register(UserService, UserModule, 'secret'),
  ],
  controllers: [AppController],
  exports: [MongooseModule],
})
export class AppModule {}
