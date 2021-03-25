import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISteam } from 'src/auth/steam/steam.type';
import Role from './schemas/role';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private configService: ConfigService
  ) {}

  async createUser(reqUser: ISteam.Profile): Promise<UserDocument> {
    const superAdminId = this.configService.get("SUPER_ADMIN");

    if (reqUser._json.steamid === superAdminId) {
      return this.userModel.create({
        id: reqUser._json.steamid,
        avatar: reqUser._json.avatarfull,
        name: reqUser._json.personaname,
        roles: [Role.SUPER_ADMIN]
      });
    }

    return this.userModel.create({
      id: reqUser._json.steamid,
      avatar: reqUser._json.avatarfull,
      name: reqUser._json.personaname,
    });
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
