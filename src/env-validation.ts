import { object, string, number } from 'joi';

export default object({
  NODE_ENV: string().valid('development', 'production').default('development'),
  STEAM_API_KEY: string().trim().required(),
  JWT_SECRET: string().trim().required(),
  PORT: number().failover(8080).default(8080),
  DATABASE_URL: string().trim().required(),
  HOST: string().default('http://localhost:3000'),
  COOKIE_DOMAIN: string().trim().default(''),
  SUPER_ADMIN: string().required(),
});
