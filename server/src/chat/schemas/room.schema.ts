import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/user.schema';
import { SchemaTypes } from 'mongoose';
import { RoomType } from '../types';
import { ID } from '../../shared.types';

export type RoomDocument = Room & Document;

@Schema()
export class Room extends Document {
  @Prop({ unique: true, required: true })
  name: string;
  @Prop({ type: SchemaTypes.String, required: true, enum: RoomType })
  type: RoomType;
  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
    validate: [arrLength, 'Room should have at least one user'],
  })
  users!: ID[];
}

function arrLength(val: []) {
  return val.length > 0;
}

export const RoomSchema = SchemaFactory.createForClass(Room);


