import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { SteamController } from './steam.controller';
import { SteamStrategy } from './steam.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule
  ],
  controllers: [SteamController],
  providers: [SteamStrategy],
})
export class SteamModule {}
