import { Module } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JWTConfigService } from './jwt.config';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JWTConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [JWTService, JWTConfigService, JwtStrategy],
  exports: [JwtModule, JWTService],
})
export class JWTModule {}
