import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Room } from '../chat/schemas/room.schema';
import { Model, Schema } from 'mongoose';
import { UserSearchQuery } from './user-search.query';
import { ID } from '../shared.types';
import { RoomType } from '../chat/types';
import { Message } from '../chat/schemas/message.schema';
import { SendInvitationDTO } from './dto/send-invitation.dto';
import {
  DocumentNotFoundError,
  IllegalOperationError,
} from '../common/error/errors';
import { Types } from 'mongoose';
import { InvitationStatus } from './types';

export interface DirectMessage {
  senderId: ID;
  recipientId: ID;
  message: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  getOne(id: ID) {
    return this.userModel.findById(id).populate('rooms');
  }

  async search(params: UserSearchQuery): Promise<User[]> {
    const { searchText, page = 0, perPage = 20 } = params;
    const regexp = new RegExp(`.*${searchText}.*`);
    return this.userModel
      .find({
        $or: [{ nickname: { $regex: regexp } }, { email: { $regex: regexp } }],
      })
      .skip(page * perPage)
      .limit(perPage);
  }

  async getRooms(id: ID): Promise<Room[]> {
    return this.roomModel.find({ users: { $in: [id] } });
  }

  async sendDirectMessage(input: DirectMessage): Promise<void> {
    const { senderId, recipientId, message } = input;

    // @ts-ignore
    let room: Room = await this.roomModel.findOne({
      name: `${senderId}${recipientId}`,
    });

    if (!room) {
      room = await this.roomModel.create({
        name: `${senderId}${recipientId}`,
        type: RoomType.direct,
        users: [senderId, recipientId],
      });

      await this.userModel.updateMany(
        { _id: { $in: [senderId, recipientId] } },
        { $push: { rooms: { $each: [senderId, recipientId] } } },
      );
    }

    await this.messageModel.create({
      message,
      sender: senderId,
      room: room._id,
    });
  }

  async sendInvitation(sender: ID, input: SendInvitationDTO): Promise<User> {
    const { recipient, room } = input;

    await this.validateSendInvitationInput(sender, input);

    await this.userModel.findOneAndUpdate(
      {
        _id: sender,
      },
      {
        $push: { invitations: { sender, recipient, room } },
      },
    );

    return this.userModel.findOneAndUpdate(
      {
        _id: recipient,
      },
      {
        $push: { invitations: { sender, recipient, room } },
      },
    );
  }

  async acceptInvitation(userId: ID, invitationId: ID) {
    const user = await this.userModel.findOne({
      'invitations._id': invitationId,
    });

    const { sender, recipient, room } = user.invitations[0];

    if (!user) {
      throw new DocumentNotFoundError('Invitation', { invitationId });
    }

    if (!recipient.equals(userId)) {
      throw new IllegalOperationError(
        'Only recipient of invitation can accept it',
      );
    }

    await this.userModel.updateMany(
      {
        'invitations.sender': sender,
        'invitations.recipient': recipient,
        'invitations.room': room,
      },
      { 'invitations.$.status': InvitationStatus.accepted },
    );

    await this.roomModel.updateOne(
      { _id: room },
      { $push: { users: recipient } },
    );
  }

  private async validateSendInvitationInput(
    sender: ID,
    input: SendInvitationDTO,
  ): Promise<void> {
    const { recipient, room } = input;

    await this.userModel.ensureIndexes();

    const senderRecord = await this.userModel.findOne({
      _id: sender,
      rooms: { $in: [room] },
    });

    const roomRecord = await this.roomModel.findById(room);

    const userRecord = await this.userModel.findOne({
      'invitations.sender': sender,
      'invitations.recipient': recipient,
      'invitations.room': room,
    });

    if (!roomRecord) {
      throw new DocumentNotFoundError('Room', { room });
    }

    if (userRecord) {
      throw new IllegalOperationError('User can not be invited twice');
    }

    if (!senderRecord) {
      throw new IllegalOperationError(
        'User can make invitations only for rooms he is in',
      );
    }

    if (sender === recipient) {
      throw new IllegalOperationError('User can not invite himself');
    }

    if (roomRecord.type !== RoomType.group) {
      throw new IllegalOperationError(
        'User can make invitation only for group chats',
      );
    }

    if (roomRecord.users.includes(recipient)) {
      throw new IllegalOperationError('Requested user is already in the group');
    }
  }

  async rejectInvitation(invitationId: ID) {
    const user = await this.userModel.findOne({
      'invitations._id': invitationId,
    });

    if (!user) {
      throw new DocumentNotFoundError('Invitation', { invitationId });
    }

    const { sender, recipient, room } = user.invitations[0];

    return this.userModel.updateMany(
      {},
      {
        $pull: {
          invitations: {
            sender,
            recipient,
            room,
          },
        },
      },
      { multi: true },
    );
  }
}
