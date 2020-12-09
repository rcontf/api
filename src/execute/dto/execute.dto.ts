import { IsNotEmpty, IsNumber } from "class-validator";

export class ExecuteCommandDto {
  @IsNotEmpty()
  readonly ip: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly command: string;

  @IsNumber()
  readonly port: number = 27015;
}
