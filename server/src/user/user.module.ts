import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Room, RoomSchema } from '../chat/schemas/room.schema';
import { Message, MessageSchema } from '../chat/schemas/message.schema';

const models = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Room.name, schema: RoomSchema },
  { name: Message.name, schema: MessageSchema },
]);

@Module({
  imports: [models],
  controllers: [UserController],
  providers: [UserService],
  exports: [models, UserService],
})
export class UserModule {}
