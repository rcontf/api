import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { SteamController } from './steam.controller';
import { SteamStrategy } from './steam.strategy';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [SteamController],
  providers: [SteamStrategy],
})
export class SteamModule {}
