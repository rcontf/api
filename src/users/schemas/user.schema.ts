import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import Role from './role';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: Role.USER })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
