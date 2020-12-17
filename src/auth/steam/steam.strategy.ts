import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/users.service';
import { ISteam } from './steam.type';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      returnURL: 'http://localhost:8080/api/auth/steam/return',
      realm: 'http://localhost:8080/',
      apiKey: configService.get<string>('STEAM_API_KEY'),
    });
  }

  async validate(
    _identifier: string,
    profile: ISteam.Profile,
  ): Promise<UserDocument> {
    const userDoc = await this.userService.getUser(profile);
    return userDoc;
  }
}
