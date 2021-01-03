import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseAuth } from 'nest-modules';
import { AnonymousUserModel } from '../user/models/anonymous.user.model';
import { UnoService } from '../uno/uno.service';
import { LobbyModel } from './models/lobby.model';
import { DeckCard } from '../uno/uno.interfaces';

@ApiBearerAuth()
@ApiTags('Lobby')
@Controller('lobby')
export class LobbyController {
  constructor(
    private lobbyService: LobbyService,
    private unoService: UnoService,
  ) {}

  @UseGuards(BaseAuth.JwtAuthGuard)
  @Post('/start')
  @ApiResponse({ status: 201, type: Boolean, description: 'Starts a game' })
  public async startLobby(@BaseAuth.AuthUser() authUser: AnonymousUserModel) {
    const lobby = await this.lobbyService.lobbyModel.findOne({
      admin: authUser._id,
    });
    if (lobby.started) {
      throw new HttpException(`Game already started`, HttpStatus.BAD_REQUEST);
    }
    let givenCards = [];
    lobby.players = lobby.players.map((p, index) => {
      const playerCards = lobby.stack.slice(0, 7);
      lobby.stack = lobby.stack.filter((card: any, index: any) => {
        return index >= 7;
      });

      givenCards = [...playerCards, ...givenCards];
      return {
        player: p.player,
        name: p.name,
        cards: playerCards,
      };
    });
    const firstCard = lobby.stack.findIndex((card) => !card.isSpecialCard);
    lobby.lastPlayedCard = lobby.stack[firstCard];

    delete lobby.stack[firstCard];
    lobby.stack = lobby.stack.filter((e) => e);
    lobby.started = true;
    lobby.currentPlayer = lobby.players[0];
    lobby.save();
    return true;
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({ status: 201, type: LobbyModel, description: 'Join a lobby' })
  @Post('/join/:id')
  public async joinLobby(
    @BaseAuth.AuthUser() authUser: AnonymousUserModel,
    @Param('id') id: string,
  ) {
    const lobbyToJoin = await this.lobbyService.lobbyModel.findById(id);
    if (!lobbyToJoin) {
      throw new HttpException(
        `Lobby ( ${id} ) not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingLobby = await this.lobbyService.lobbyModel.findOne({
      admin: authUser._id,
    });

    if (existingLobby && id !== existingLobby.id) {
      await existingLobby.delete();
    } else if (existingLobby) {
      return existingLobby.toJSON();
    }

    if (lobbyToJoin.players.length <= 3) {
      if (!lobbyToJoin.players.find((p) => p.player === authUser._id)) {
        lobbyToJoin.players.push({
          player: authUser._id,
          name: authUser.name,
          cards: [],
        });
        await lobbyToJoin.save();
      }
      return lobbyToJoin.toJSON();
    } else {
      throw new HttpException(
        `Lobby has already 4 players.`,
        HttpStatus.CONFLICT,
      );
    }
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({ status: 201, type: Boolean, description: 'Leave a lobby' })
  @Post('/leave/:id')
  public async leaveLobby(
    @BaseAuth.AuthUser() authUser: AnonymousUserModel,
    @Param('id') id: string,
  ) {
    const lobbyToLeave = await this.lobbyService.lobbyModel.findById(id);
    if (!lobbyToLeave) {
      throw new HttpException(
        `Lobby ( ${id} ) not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (lobbyToLeave.players.find((p) => p.player === authUser._id)) {
      lobbyToLeave.players = lobbyToLeave.players.filter(
        (player) => player.player !== authUser._id,
      );
      await lobbyToLeave.save();
      return true;
    } else {
      throw new HttpException(
        `You are not in lobby ( ${id} )`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return lobbyToLeave.toJSON();
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({
    status: 201,
    type: LobbyModel,
    description: 'Creates a lobby',
  })
  @Post('/create')
  public async createLobby(@BaseAuth.AuthUser() authUser: AnonymousUserModel) {
    const existingLobby = await this.lobbyService.lobbyModel.findOne({
      admin: authUser._id,
    });
    if (existingLobby) {
      throw new HttpException(
        `Please close your lobby ( ${existingLobby._id} ) before you create a new one`,
        HttpStatus.FORBIDDEN,
      );
    }
    const newLobby = await this.lobbyService.lobbyModel.create({
      admin: authUser._id,
      players: [{ player: authUser._id, name: authUser.name, cards: [] }],
      currentPlayer: null,
      stack: this.unoService.shuffle(this.unoService.getNewDeck()),
    });
    try {
      const res = await newLobby.save();
      return res.toJSON();
    } catch (e) {
      throw new HttpException(
        `Error while creating lobby.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({ status: 201, type: Boolean, description: 'closes a game' })
  @Post('/close')
  public async closeLobby(@BaseAuth.AuthUser() authUser: AnonymousUserModel) {
    const existingLobby = await this.lobbyService.lobbyModel.findOne({
      admin: authUser._id,
    });
    if (!existingLobby) {
      throw new HttpException(`No lobby found`, HttpStatus.FORBIDDEN);
    }

    try {
      await existingLobby.delete();
      return true;
    } catch (e) {
      throw new HttpException(
        `Error while deleting lobby.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({
    status: 201,
    type: LobbyModel,
    description: 'Returns your lobby',
  })
  @Get('/myLobby')
  public async getMyLobby(@BaseAuth.AuthUser() authUser: AnonymousUserModel) {
    const existingLobby = await this.lobbyService.lobbyModel.findOne({
      admin: authUser._id,
    });
    return existingLobby?.toJSON() ?? null;
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({
    status: 201,
    type: Boolean,
    description: 'Checks if lobby exists',
  })
  @Get('/findLobby/:id')
  public async findLobby(
    @BaseAuth.AuthUser() authUser: AnonymousUserModel,
    @Param('id') id: string,
  ) {
    try {
      const existingLobby = await this.lobbyService.lobbyModel.findById(id);
      return existingLobby ? true : false;
    } catch (e) {
      return false;
    }
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({
    status: 201,
    type: LobbyModel,
    description: 'Gets lobby by id',
  })
  @Get('/getlobby/:id')
  public async getLobby(
    @BaseAuth.AuthUser() authUser: AnonymousUserModel,
    @Param('id') id: string,
  ) {
    try {
      const existingLobby = await this.lobbyService.lobbyModel.findById(id);
      return existingLobby;
    } catch (e) {
      return null;
    }
  }

  @UseGuards(BaseAuth.JwtAuthGuard)
  @ApiResponse({
    status: 201,
    type: LobbyModel,
    description: 'Gets lobby by id',
  })
  @Post('/lobby/:id/playCard')
  public async playCard(
    @BaseAuth.AuthUser() authUser: AnonymousUserModel,
    @Body() cardToPlay: DeckCard,
    @Param('id') id: string,
  ) {
    try {
      const gameLobby = await this.lobbyService.lobbyModel.findById(id);

      if (!gameLobby.started) {
        throw new HttpException('Game not started yet', HttpStatus.BAD_REQUEST);
      }

      if (gameLobby.currentPlayer.player !== authUser._id) {
        throw new HttpException(
          `It's ${gameLobby.currentPlayer.name}'s turn.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!this.lobbyService.isCardPlayable(cardToPlay, gameLobby, authUser)) {
        throw new HttpException(
          `This card is not playable.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      gameLobby.playedCards.push(cardToPlay);
      gameLobby.lastPlayedCard = cardToPlay;
      let nextPlayerIndex = 0;
      gameLobby.players = gameLobby.toJSON().players.map((player, index) => {
        if (player.player === authUser._id) {
          nextPlayerIndex = index + 1;
          if (nextPlayerIndex > gameLobby.players.length - 1) {
            nextPlayerIndex = 0;
          }
          const playedCardIndex = player.cards.findIndex(
            (card) => JSON.stringify(card) === JSON.stringify(cardToPlay),
          );
          return {
            ...player,
            cards: player.cards.filter(
              (card, index) => index !== playedCardIndex,
            ),
          };
        }
        return player;
      });

      gameLobby.currentPlayer = gameLobby.players[nextPlayerIndex];
      console.log(nextPlayerIndex);
      const nextPlayerHasPlayAbleCard = this.lobbyService.playerHasPlayAbleCard(
        gameLobby,
        gameLobby.currentPlayer,
      );
      /*!!gameLobby.currentPlayer.cards.find(
        (card) =>
          this.lobbyService.isCardPlayable(card, gameLobby, {
            _id: gameLobby.currentPlayer.player,
            name: gameLobby.currentPlayer.name,
          }),
      );*/

      /*if (!nextPlayerHasPlayAbleCard) {
        this.lobbyService.giveNCardsToUser(
          gameLobby,
          gameLobby.currentPlayer,
          1,
        );
      }*/
      await gameLobby.save();

      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
      return null;
    }
  }
  @UseGuards(BaseAuth.JwtAuthGuard)
  @Post('/lobby/:id/takeOneCard')
  public async takeOneCard(
    @BaseAuth.AuthUser() authUser: AnonymousUserModel,
    @Param('id') id: string,
  ) {
    try {
      const gameLobby = await this.lobbyService.lobbyModel.findById(id);

      if (!gameLobby.started) {
        throw new HttpException('Game not started yet', HttpStatus.BAD_REQUEST);
      }

      if (gameLobby.currentPlayer.player !== authUser._id) {
        throw new HttpException(
          `It's ${gameLobby.currentPlayer.name}'s turn.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      this.lobbyService.giveNCardsToUser(gameLobby, gameLobby.currentPlayer, 1);
      if (
        !this.lobbyService.playerHasPlayAbleCard(
          gameLobby,
          gameLobby.currentPlayer,
        )
      ) {
        let nextPlayerIndex = 0;
        gameLobby.toJSON().players.map((player, index) => {
          if (player.player === authUser._id) {
            nextPlayerIndex = index + 1;
            if (nextPlayerIndex > gameLobby.players.length - 1) {
              nextPlayerIndex = 0;
            }
            return true;
          }
        });

        gameLobby.currentPlayer = gameLobby.players[nextPlayerIndex];
      }
      await gameLobby.save();

      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
      return null;
    }
  }
}
