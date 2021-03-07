import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { ID } from '../shared.types';

@Schema()
export class Invitation {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  inviter: ID;
  @Prop({ type: SchemaTypes.ObjectId, require: true })
  room: ID;
  @Prop({ type: SchemaTypes.Date, default: Date.now() })
  createdAt: string;
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: ID;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  nickname: string;

  @Prop()
  avatar: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Room' }] })
  rooms: Types.ObjectId[];

  // @Prop({ type: [Invitation] })
  // invitations: ID[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  // @ts-ignore
  delete obj.password;
  return obj;
};
