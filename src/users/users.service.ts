import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISteam } from 'src/auth/steam/steam.type';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUser(reqUser: ISteam.Profile): Promise<UserDocument> {
    let user: UserDocument | null;

    user = await this.userModel.findOne({ id: reqUser._json.steamid });

    if (!user) {
      user = new this.userModel({
        id: reqUser._json.steamid,
        avatar: reqUser._json.avatarfull,
        name: reqUser._json.personaname,
      });

      await user.save();
    }

    return user;
  }

  async findUser(steamId: string): Promise<UserDocument> {
    const user: UserDocument | null = await this.userModel.findOne({
      id: steamId,
    });

    return user;
  }

  async deleteUser(steamId: string): Promise<void> {
    await this.userModel.findOneAndDelete({ id: steamId });
  }
}
