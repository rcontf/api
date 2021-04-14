import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, UpdateQuery } from 'mongoose';
import { ISteam } from 'src/auth/types/steam.type';
import Role from './schemas/role';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async getById(id: string) {
    return await this.userModel.findById(id);
  }

  async findUserBySteamId(steamId: string) {
    return await this.userModel.findOne({ steamId });
  }

  async createUser(user: ISteam.Profile) {
    const superAdminId = this.configService.get('SUPER_ADMIN');

    return await this.userModel.create({
      steamId: user._json.steamid,
      avatar: user._json.avatarfull,
      name: user._json.personaname,
      roles: user._json.steamid === superAdminId ? [Role.SUPER_ADMIN] : [],
    });
  }

  async updateUser(userId: string, object: UpdateQuery<User>) {
    return await this.userModel.findOneAndUpdate({ _id: userId }, object, {
      new: true,
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
