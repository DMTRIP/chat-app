import { Test } from '@nestjs/testing';
import { rootMongooseTestModule } from '../helpers/test-database.module';
import { UserModule } from '../user/user.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room-dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { RoomType } from './types';
import { CreateMessageDTO } from './dto/create-message-dto';

const userDTO: CreateUserDto = {
  // @ts-ignore
  _id: Types.ObjectId(),
  avatar: 'asd',
  email: 'dd@dd.com',
  firstName: 'asd',
  lastName: 'asd',
  nickname: 'dddd',
  password: '1',
};

describe('Chat', () => {
  let chatService: ChatService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [
          rootMongooseTestModule(),
          MongooseModule.forFeature([
            {
              name: Room.name,
              schema: RoomSchema,
            },
            {
              name: Message.name,
              schema: MessageSchema,
            },
          ]),
          UserModule,
        ],
        controllers: [ChatController],
        providers: [ChatGateway, ChatService],
      }).compile(),
    ]);

    chatService = module.get<ChatService>(ChatService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should create individual room', async function () {
    const createdUser = await userModel.create(userDTO);
    const createRoomDTO: CreateRoomDto = {
      name: 'test',
      type: RoomType.direct,
      userIds: [createdUser._id],
    };
    const createdRoom = await chatService.createRoom(createRoomDTO);
    const user = await userModel.findOne({ _id: createdUser._id });

    expect(createdRoom.name).toBe(createRoomDTO.name);
    expect(user ? user.rooms : []).toHaveLength(1);
  });

  it('should not create room without a user', async function (done) {
    const createRoomDto: CreateRoomDto = {
      name: '',
      type: RoomType.direct,
      userIds: [],
    };

    try {
      await chatService.createRoom(createRoomDto);
      done('create a room without any user');
    } catch (e) {
      done();
    }
  });

  it('should create a message', async function () {
    const user = await userModel.create(userDTO);
    const createRoomDto: CreateRoomDto = {
      name: 'asdasd',
      type: RoomType.direct,
      userIds: [user._id],
    };
    const room = await chatService.createRoom(createRoomDto)
    const createMessageDto: CreateMessageDTO = {
      message: 'message', roomId: room._id
    }
    const res = await chatService.createMessage(createMessageDto, user._id)

    expect(res.message).toBe(createMessageDto.message)
  });
});
