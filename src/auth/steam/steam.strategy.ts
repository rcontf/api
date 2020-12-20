import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/users.service';
import { ISteam } from './steam.type';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private userService: UserService,
    @Inject(REQUEST) readonly req: Request,
  ) {
    super({
      returnURL: `${configService.get<string>('HOST') || 'localhost:8080'}/api/auth/steam/return`,
      realm: `${configService.get<string>('HOST') || 'localhost:8080'}`,
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
