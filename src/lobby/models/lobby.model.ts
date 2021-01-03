import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DeckCard } from '../../uno/uno.interfaces';

class PlayerCards {
  @ApiProperty()
  player: string;
  @ApiProperty()
  cards: string[];
}
export class LobbyPlayer {
  @ApiProperty()
  name: string;
  @ApiProperty()
  player: string;

  @ApiProperty({
    isArray: true,
    type: DeckCard,
  })
  cards: DeckCard[];
}

@Schema({ timestamps: true })
export class LobbyModel {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  @Prop()
  admin: string;

  @ApiProperty()
  @Prop()
  started?: boolean;

  @ApiProperty({
    isArray: true,
    type: LobbyPlayer,
  })
  @Prop()
  players?: LobbyPlayer[];

  @ApiProperty()
  @Prop()
  currentPlayer?: LobbyPlayer;

  @ApiProperty({
    isArray: true,
    type: DeckCard,
  })
  @Prop()
  stack?: DeckCard[];

  @ApiProperty({
    isArray: true,
    type: DeckCard,
  })
  @Prop()
  playedCards?: DeckCard[];

  @ApiProperty()
  @Prop()
  lastPlayedCard?: DeckCard;

  @ApiProperty()
  @Prop()
  nextPlayer?: LobbyPlayer;

  @ApiProperty()
  @Prop()
  createdAt?: Date;

  @ApiProperty()
  @Prop()
  updatedAt?: Date;
}

export const lobbySchema = SchemaFactory.createForClass(LobbyModel);
