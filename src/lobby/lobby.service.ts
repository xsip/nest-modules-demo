import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { LobbyModel, LobbyPlayer } from './models/lobby.model';
import { BaseUser } from 'nest-modules';
import { AnonymousUserModel } from '../user/models/anonymous.user.model';
import { DeckCard, SpecialCards } from '../uno/uno.interfaces';

@Injectable()
export class LobbyService {
  constructor(
    @InjectModel('lobby') public lobbyModel: Model<LobbyModel & Document>,
  ) {}

  isCardPlayable(
    card: DeckCard,
    lobby: LobbyModel,
    currentUser: AnonymousUserModel,
  ): boolean {
    const lastPlayedCard = lobby?.lastPlayedCard;

    console.log(card);
    if (lobby?.currentPlayer.player !== currentUser._id) {
      return false;
    }

    if (
      card.specialCardName === SpecialCards.Wild ||
      card.specialCardName === SpecialCards.WildTakeFour
    ) {
      return true;
    }

    if (lastPlayedCard?.isSpecialCard && card.isSpecialCard) {
      return card.specialCardName === lastPlayedCard.specialCardName;
    } else if (lastPlayedCard?.color === card.color) {
      return true;
    } else if (lastPlayedCard?.num === card.num) {
      return true;
    }
    return false;
  }

  giveNCardsToUser(
    lobby: LobbyModel & Document,
    player: LobbyPlayer,
    nCards: number,
  ) {
    let givenCards = [];
    lobby.players = lobby.players.map((p, index) => {
      if (p.player === player.player) {
        const playerCards = lobby.stack.slice(0, nCards);
        lobby.stack = lobby.stack.filter((card: any, index: any) => {
          return index >= nCards;
        });

        givenCards = [...playerCards, ...givenCards];
        return {
          player: p.player,
          name: p.name,
          cards: [...p.cards, ...playerCards],
        };
      }
      return p;
    });
  }

  playerHasPlayAbleCard(
    gameLobby: LobbyModel & Document,
    player: LobbyPlayer,
  ): boolean {
    return !!player.cards.find((card) =>
      this.isCardPlayable(card, gameLobby, {
        _id: player.player,
        name: player.name,
      }),
    );
  }
}
