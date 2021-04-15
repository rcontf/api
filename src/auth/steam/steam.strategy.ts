import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { UserService } from '../../users/users.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { ISteam } from './steam.type';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      returnURL: `${
        configService.get<string>('HOST') || 'localhost:8080'
      }/api/auth/steam/return`,
      realm: `${configService.get<string>('HOST') || 'localhost:8080'}`,
      apiKey: configService.get<string>('STEAM_API_KEY'),
    });
  }

  async validate(
    _identifier: string,
    profile: ISteam.Profile,
  ): Promise<UserDocument> {
    const userDoc = await this.userService.findUser(profile._json.steamid);

    if (!userDoc) {
      return await this.userService.createUser(profile);
    }

    return userDoc;
  }
}
