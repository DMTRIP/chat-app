import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/user.schema';
import { Room } from './room.schema';
import { ID } from '../../shared.types';

export type MessageDocument = Message & Document;

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  message: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  sender: ID;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Room', required: true })
  room: Types.ObjectId;
  @Prop({ type: SchemaTypes.Date, defaultValue: Date.now() })
  createdAt: string;
  @Prop({ type: SchemaTypes.Date })
  updatedAt: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
