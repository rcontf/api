import { Injectable } from '@nestjs/common'
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JWTConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
    }
  }
}