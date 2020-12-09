import { IsNotEmpty } from 'class-validator';
import { ServerType } from 'src/servers/schemas/server.schema';

export class UpdateDto {
  @IsNotEmpty()
  readonly secret: string;

  @IsNotEmpty()
  readonly type: ServerType;
}
