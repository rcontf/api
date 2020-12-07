import { Module } from '@nestjs/common';
import { SteamModule } from './steam/steam.module';

@Module({
  imports: [SteamModule],
})
export class AuthModule {}
