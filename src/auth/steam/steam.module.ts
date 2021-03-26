import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JWTModule } from '../jwt/jwt.module';
import { SteamController } from './steam.controller';
import { SteamStrategy } from './steam.strategy';

@Module({
  imports: [UsersModule, JWTModule],
  controllers: [SteamController],
  providers: [SteamStrategy],
})
export class SteamModule {}
