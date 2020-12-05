import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        STEAM_API_KEY: Joi.string().trim().required(),
        JWT_SECRET: Joi.string().trim().required(),
        PORT: Joi.number().failover(8080).default(8080),
      }),
    }),
  ],
})
export class AppModule {}
