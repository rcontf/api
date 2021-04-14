import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { UserService } from '../../users/users.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { ISteam } from '../types/steam.type';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      returnURL: `${configService.get<string>(
        'API_URL',
      )}/api/auth/steam/return`,
      realm: `${configService.get<string>('API_URL')}`,
      apiKey: configService.get<string>('STEAM_API_KEY'),
    });
  }

  async validate(_identifier: string, profile: ISteam.Profile) {
    try {
      const user = await this.userService.findUserBySteamId(profile._json.steamid);
      return await this.userService.updateUser(user._id, {
        name: profile._json.personaname,
        avatar: profile._json.avatarfull,
      });
    } catch (err) {
      return await this.userService.createUser(profile);
    }
  }
}
