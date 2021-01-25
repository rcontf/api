import { IsNotEmpty, IsNumber } from "class-validator";

export class SubscribeServerDto {
  @IsNotEmpty()
  readonly ip: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNumber()
  readonly port: number = 27015;
}
