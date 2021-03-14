import { Test, TestingModule } from '@nestjs/testing';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../helpers/test-database.module';
import { getModelToken } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { DirectMessage, UserService } from './user.service';
import { Room } from '../chat/schemas/room.schema';
import { Message } from '../chat/schemas/message.schema';
import { RoomType } from '../chat/types';

const userDTO = {
  //@ts-ignore
  _id: Types.ObjectId(),
  firstName: 'Harley',
  lastName: 'Quinn',
  nickname: 'a quine',
  email: 'harley@suicidesqud.com',
  password: '1',
};

describe('User', () => {
  let userService: UserService;
  let module: TestingModule;
  let userModel: Model<UserDocument>;
  let roomModel: Model<Room>;
  let messageModel: Model<Message>;
  let helpers = createHelpers(userModel, roomModel);

  beforeEach(async () => {
    [module] = await Promise.all([
      Test.createTestingModule({
        imports: [rootMongooseTestModule(), UserModule],
        providers: [UserService],
      }).compile(),
    ]);

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    roomModel = module.get<Model<Room>>(getModelToken(Room.name));
    messageModel = module.get<Model<Message>>(getModelToken(Message.name));
    helpers = createHelpers(userModel, roomModel);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should find user by id', async function () {
    const createdUser = await userModel.create(userDTO);
    const userRecord = await userService.getOne(createdUser._id);
    expect(userRecord).toBeTruthy();
  });

  it('should find a user by part of nickname', async function () {
    await userModel.create(userDTO);

    const partOfNickname = userDTO.nickname.slice(2);
    const res = await userService.search({ searchText: partOfNickname });

    expect(res).toHaveLength(1);
  });

  it('should find a user by part of email', async function () {
    await userModel.create(userDTO);

    const partOfEmail = userDTO.email.slice(2);
    const res = await userService.search({ searchText: partOfEmail });

    expect(res).toHaveLength(1);
  });

  it('should send direct message', async function () {
    const userInput: User = {
      // @ts-ignore
      _id: Types.ObjectId(),
      avatar: 'asdasd',
      email: 'dd@ddc.com',
      firstName: 'Bob',
      lastName: 'Brown',
      nickname: 'dddd',
      password: '1',
      rooms: [],
    };
    const user = await userModel.create(userInput);
    const directMessage: DirectMessage = {
      message: 'a message',
      recipientId: user._id,
      senderId: user._id,
    };

    await userService.sendDirectMessage(directMessage);
    const rooms = await roomModel.find();
    const messages = await messageModel.find();

    expect(rooms[0].users).toHaveLength(2);
    expect(messages).toHaveLength(1);
  });

  it('should send invitation', async function () {
    const { sender, recipient, room } = await helpers.createSendInviteMock();

    await userService.sendInvitation(sender, {
      recipient,
      room,
    });

    expect((await userModel.findById(sender)).invitations).toHaveLength(1);
    expect((await userModel.findById(recipient)).invitations).toHaveLength(1);
  });

  it('should not send invitation to group member', async function (done) {
    const { sender, recipient, room } = await helpers.createSendInviteMock();

    try {
      await userService.sendInvitation(sender, {
        recipient: sender,
        room,
      });
      done('err');
    } catch (e) {
      done();
    }
  });

  it('should not send invitation twice', async function (done) {
    const { sender, recipient, room } = await helpers.createSendInviteMock();

    try {
      await userService.sendInvitation(sender, {
        recipient,
        room,
      });
      await userService.sendInvitation(sender, {
        recipient,
        room,
      });

      //console.log(res1, res2)
      done('err');
    } catch (e) {
      done();
    }
  });

  it('only members of group should send invitations', async function (done) {
    const { sender, recipient, room } = await helpers.createSendInviteMock();

    try {
      await userService.sendInvitation(recipient, {
        recipient: sender,
        room,
      });
      done('err');
    } catch (e) {
      done();
    }
  });

  it('should not send invitation to themself', async function (done) {
    const { sender, recipient, room } = await helpers.createSendInviteMock();

    try {
      await userService.sendInvitation(recipient, {
        recipient: sender,
        room,
      });
      done('err');
    } catch (e) {
      done();
    }
  });

  it('should not send invitation to direct room', async function (done) {
    const { sender, recipient, room } = await helpers.createSendInviteMock();
    await roomModel.findOneAndUpdate({ _id: room }, { type: RoomType.direct });

    try {
      await userService.sendInvitation(recipient, {
        recipient: sender,
        room,
      });
      done('err');
    } catch (e) {
      done();
    }
  });

  it('should accept invitation', async function () {
    const { sender, recipient, room } = await helpers.createSendInviteMock();
    await userService.sendInvitation(sender, { recipient, room });
    const { invitations } = await userModel.findOne({ _id: sender });
    await userService.acceptInvitation(recipient, invitations[0]._id);

    const [user1, user2] = await userModel.find();

    expect(user1.invitations[0].status).toEqual('accepted');
    expect(user2.invitations[0].status).toEqual('accepted');
  });

  it('should not accept invitation', async function (done) {
    try {
      const { sender, recipient, room } = await helpers.createSendInviteMock();
      await userService.sendInvitation(sender, { recipient, room });
      const { invitations } = await userModel.findOne({ _id: sender });
      await userService.acceptInvitation(sender, invitations[0]._id);
      done('err');
    } catch (e) {
      done();
    }
  });

  it('should reject invitation', async function () {
    const { sender, recipient, room } = await helpers.createSendInviteMock();
    await userService.sendInvitation(sender, { recipient, room });
    const { invitations } = await userModel.findOne({ _id: sender });
    await userService.rejectInvitation(invitations[0]._id);

    expect((await userModel.findOne({ _id: sender })).invitations).toHaveLength(
      0,
    );
  });
});

function createHelpers(userModel, roomModel) {
  return {
    async createSendInviteMock() {
      const [sender, recipient] = await userModel.create([
        userDTO,
        {
          ...userDTO,
          email: 'asdw@dd.com',
          nickname: 'naruto',
          _id: Types.ObjectId(),
        },
      ]);

      const room = await roomModel.create({
        name: 'asdasd',
        type: 'group',
        users: [sender._id],
      });

      await userModel.findOneAndUpdate(
        {
          _id: sender._id,
        },
        { $push: { rooms: room._id } },
      );

      return { sender: sender._id, recipient: recipient._id, room: room._id };
    },
  };
}
