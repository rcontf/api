import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateServerDto {
  @IsNotEmpty()
  readonly hostname: string;

  @IsNotEmpty()
  readonly ip: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNumber()
  readonly port: number = 27015;
}
