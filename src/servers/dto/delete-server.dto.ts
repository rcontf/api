import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteServerDto {
  @IsNotEmpty()
  @IsString()
  readonly ip: string;
}
