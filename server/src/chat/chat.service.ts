import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { Model } from 'mongoose';
import { ID } from '../shared.types';
import { CreateRoomDto } from './dto/create-room-dto';
import { User, UserDocument } from '../user/user.schema';
import { Message } from './schemas/message.schema';
import { CreateMessageDTO } from './dto/create-message-dto';
import { GetMessagePageParams } from './get-message-page.params';
import { RoomType } from './types';
import {DocumentNotFoundError, IllegalOperationError} from "../common/error/errors";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = await this.roomModel.create({
      ...createRoomDto,
      users: createRoomDto.userIds,
    });

    await this.userModel.updateMany(
      {
        _id: {
          $in: createRoomDto.userIds,
        },
      },
      { $push: { rooms: room._id } },
    );

    return room;
  }

  async createMessage(
    messageDTO: CreateMessageDTO,
    userId: ID,
  ): Promise<Message> {
    return this.messageModel.create({
      ...messageDTO,
      room: messageDTO.roomId,
      sender: userId,
    });
  }

  async addUserToPublicRoom(userId: ID, roomId: ID): Promise<void> {
    const room = await this.roomModel.findOne({ _id: roomId });

    if (!room) {
      throw new DocumentNotFoundError('Room', { roomId })
    }

    if (room.type !== RoomType.group) {
      throw new IllegalOperationError('users can not join to direct rooms')
    }

    // @ts-ignore
    room.users.push(userId);
    await room.save();
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { rooms: roomId } },
    );
  }

  async getMessagePage(roomId: ID, params: GetMessagePageParams) {
    const { perPage, page } = params;

    return this.messageModel
      .find({
        room: roomId,
      })
      .skip(page * perPage)
      .limit(perPage)
      .populate('user');
  }

  async leaveRoom(roomId: ID, userId: ID): Promise<void> {
    const room = await this.roomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $pullAll: { users: [userId] },
      },
      { new: true },
    );

    if (!room) {
      throw new DocumentNotFoundError('Room', { roomId })
    }

    await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $pullAll: { rooms: [roomId] },
      },
    );

    if (room.users.length === 0) {
      await this.roomModel.deleteOne({ _id: roomId });
    }
  }
}
