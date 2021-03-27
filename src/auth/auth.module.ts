import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { SteamModule } from './steam/steam.module';
import { AuthController } from './auth.controller';
import { JWTModule } from './jwt/jwt.module';

@Module({
  imports: [SteamModule, UsersModule, JWTModule],
  controllers: [AuthController],
})
export class AuthModule {}
