import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { BaseUser } from 'nest-modules';
import { lobbySchema } from './models/lobby.model';
import { LobbyService } from './lobby.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UnoModule } from '../uno/uno.module';

@Module({
  controllers: [LobbyController],
  imports: [
    UnoModule,
    MongooseModule.forFeature([
      {
        name: 'lobby',
        schema: lobbySchema,
      },
    ]),
  ],
  providers: [LobbyService],
  exports: [LobbyService],
})
export class LobbyModule {}
