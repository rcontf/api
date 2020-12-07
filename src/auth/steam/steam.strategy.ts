import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-steam';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { ISteam } from './steam.type';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      returnURL: 'http://localhost:8080/auth/steam/return',
      realm: 'http://localhost:8080/',
      apiKey: configService.get<string>('STEAM_API_KEY'),
    });
  }

  private async getUser(reqUser: ISteam.Profile): Promise<UserDocument> {
    let user: Model<UserDocument> | UserDocument | null;

    user = await this.userModel.findOne({ id: reqUser._json.steamid });

    if (!user) {
      user = new this.userModel({
        id: reqUser._json.steamid,
        avatar: reqUser._json.avatarfull,
      });

      await user.save();
    }

    return user;
  }

  async validate(
    _identifier: string,
    profile: ISteam.Profile,
  ): Promise<UserDocument> {
    const userDoc = await this.getUser(profile);
    return userDoc;
  }
}
