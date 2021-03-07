import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Room } from '../chat/schemas/room.schema';
import { Model } from 'mongoose';
import { UserSearchQuery } from './user-search.query';
import { ID } from '../shared.types';
import { RoomType } from '../chat/types';
import { Message } from '../chat/schemas/message.schema';

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

  async sendDirectMessage(input: DirectMessage) {
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
}
