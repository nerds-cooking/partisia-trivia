import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByAddress(address: string) {
    return this.userModel.findOne({ address });
  }

  async findByPublicKey(publicKey: string) {
    return this.userModel.findOne({ publicKey });
  }

  async findOrCreate(address: string, publicKey: string) {
    let user = await this.userModel.findOne({ address, publicKey });
    if (!user) {
      user = new this.userModel({ address, publicKey, nonce: '' });
      await user.save();
    }
    return user;
  }

  async upsertNonce(address: string, nonce: string) {
    return this.userModel.findOneAndUpdate(
      { address },
      { $set: { nonce } },
      { upsert: true, new: true },
    );
  }
}
