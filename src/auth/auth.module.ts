import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { SteamModule } from './steam/steam.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [SteamModule, UsersModule],
  controllers: [AuthController]
})
export class AuthModule {}
