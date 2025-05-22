import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  RequestSession,
  RequestSessionType,
} from 'src/auth/decorators/request-session';
import { CreateGamePayload } from '../payloads/CreateGame.payload';
import { GameService } from '../services/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/')
  async createGame(
    @Body() payload: CreateGamePayload,
    @RequestSession() session: RequestSessionType,
  ) {
    if (!session.user) {
      throw new Error('User not found in session');
    }

    try {
      return await this.gameService.createGame(payload, session.user);
    } catch (e) {
      console.error('Error creating game:', e);
      throw new Error('Failed to create game');
    }
  }

  @Get('/')
  async getGames(@Query('page') page: string, @Query('limit') limit: string) {
    try {
      return await this.gameService.getGames(
        Number(page || 1),
        Number(limit || 10),
      );
    } catch (e) {
      console.error('Error fetching games:', e);
      throw new Error('Failed to fetch games');
    }
  }

  @Get('/state')
  async getState(@RequestSession() session: RequestSessionType) {
    if (!session.user) {
      throw new Error('User not found in session');
    }

    try {
      const game = await this.gameService.getOnChainState();

      if (!game) {
        throw new Error('Game not found');
      }

      return game;
    } catch (e) {
      console.error('Error fetching game state:', e);
      throw new Error('Failed to fetch game state');
    }
  }

  @Get('/:gameId')
  async getGameById(@Param('gameId') gameId: string) {
    try {
      const game = await this.gameService.getGameById(gameId);

      if (!game) {
        throw new Error('Game not found');
      }

      // Fetch the on-chain game state
      const onChainGameState =
        await this.gameService.getOnChainGameState(gameId);
      if (!onChainGameState) {
        throw new Error('On-chain game state not found');
      }

      return {
        ...game.toObject(),
        onChainGameState,
      };
    } catch (e) {
      console.error('Error fetching game:', e);
      throw new Error('Failed to fetch game');
    }
  }
}
