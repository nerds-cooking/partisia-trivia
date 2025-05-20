import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ChainControllerApi,
  Configuration,
} from '@partisiablockchain/blockchain-api-transaction-client';
import { SessionUser } from 'express-session';
import { Model } from 'mongoose';
import { SettingService } from 'src/settings/services/setting.service';
import { UserService } from '../../users/services/user.service';
import { CreateGamePayload } from '../payloads/CreateGame.payload';
import { Game } from '../schemas/game.schema';
import { GameStatus } from '../types/GameStatus.enum';
import { deserializeState } from '../utils/TriviaApiGenerated';

@Injectable()
export class GameService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
    @Inject(forwardRef(() => SettingService))
    private readonly settingService: SettingService,
  ) {}

  async createGame(
    payload: CreateGamePayload,
    sessionUser: SessionUser,
  ): Promise<Game> {
    const user = await this.userService.findByAddress(sessionUser.address);

    if (!user) {
      throw new Error('User not found');
    }

    const game = new this.gameModel({
      ...payload,
      creator: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: GameStatus.IN_PROGRESS,
    });

    await game.save();
    return game;
  }

  async getGameById(gameId: string): Promise<Game | null> {
    return this.gameModel.findOne({ gameId }).exec();
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    return this.gameModel
      .find({ category })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async getGamesByCreator(creatorId: string): Promise<Game[]> {
    return this.gameModel
      .find({ creator: creatorId })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async finishGame(gameId: string): Promise<void> {
    const game = await this.gameModel.findOne({ gameId }).exec();
    if (!game) {
      throw new Error('Game not found');
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game is not in progress');
    }
    game.status = GameStatus.FINISHED;
    game.updatedAt = new Date();
    await game.save();
  }

  async getOnChainState(): Promise<any> {
    const settings = await this.settingService.findAll();

    const contractAddress = settings.find(
      (s) => s.name === 'contractAddress',
    )?.value;
    if (!contractAddress) {
      throw new Error('Contract address not found');
    }
    const partisiaClientUrl = settings.find(
      (s) => s.name === 'partisiaClientUrl',
    )?.value;
    if (!partisiaClientUrl) {
      throw new Error('Partisia client URL not found');
    }

    const client = new ChainControllerApi(
      new Configuration({
        basePath: partisiaClientUrl,
      }),
    );

    const contract = await client.getContract({
      address: contractAddress,
    });

    const shardId = contract.shardId;

    const endpoint = `shards/${shardId}/blockchain/contracts/${contractAddress}`;

    const response = await fetch(`${partisiaClientUrl}/${endpoint}`);

    const s = await response.json();

    const stateBuffer = Buffer.from(
      s.serializedContract.openState.openState.data,
      'base64',
    );
    return deserializeState(stateBuffer);
  }
}
