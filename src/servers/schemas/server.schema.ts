import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Logs } from 'src/logs/schemas/log.schema';

export type ServerDocument = Server & Document;

export type ServerType = 'tf2';

@Schema()
export class Server {
  @Prop()
  owner: string;

  @Prop()
  ip: string;

  @Prop()
  port: number;

  @Prop()
  password: string;

  @Prop()
  hostname: string;

  @Prop()
  type: ServerType;

  @Prop([Logs])
  logs: Logs[];
}

export const ServerSchema = SchemaFactory.createForClass(Server);
