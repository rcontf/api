import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { SteamModule } from './steam/steam.module';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { JWTModule } from './jwt/jwt.module';

@Module({
  imports: [SteamModule, UsersModule, JWTModule],
  providers: [ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
