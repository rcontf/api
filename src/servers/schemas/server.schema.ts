import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const ServerSchema = SchemaFactory.createForClass(Server);
