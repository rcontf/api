import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogsDocument = Logs & Document;

@Schema()
export class Logs {
  @Prop()
  actor: string;

  @Prop()
  action: string;

  @Prop({ type: Number, default: Date.now() })
  timestamp: number;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
