import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { SteamModule } from './steam/steam.module';

@Module({
  imports: [SteamModule, UsersModule]
})
export class AuthModule {}
