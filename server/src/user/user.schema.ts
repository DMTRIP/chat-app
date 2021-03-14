import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { ID } from '../shared.types';
import { InvitationStatus } from './types';

@Schema()
class Invitation {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'User' })
  sender: ID;
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'User' })
  recipient: ID;
  @Prop({ type: SchemaTypes.ObjectId, require: true, ref: 'Room' })
  room: ID;
  @Prop({
    type: SchemaTypes.String,
    enum: InvitationStatus,
    default: InvitationStatus.pending,
  })
  status?: InvitationStatus;
  @Prop({ type: SchemaTypes.Date, default: Date.now() })
  createdAt?: string;
}

class InvitationWithID extends Invitation {
  _id: Types.ObjectId
}

const InvitationScheme = SchemaFactory.createForClass(Invitation);

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

  @Prop({ type: [InvitationScheme] })
  invitations?: InvitationWithID[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  // @ts-ignore
  delete obj.password;
  return obj;
};
