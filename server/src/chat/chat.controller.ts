import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room-dto';
import { ChatService } from './chat.service';
import { RequestUser } from '../decorators/user.decorator';
import { User } from '../user/user.schema';
import { ID } from '../shared.types';

@Controller('/room')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  createRoom(@Body() createRoomDTO: CreateRoomDto) {
    return this.chatService.createRoom(createRoomDTO);
  }

  @Post('/:roomId/message')
  createMessage(
    @Param() { roomId }: { roomId: ID },
    @Body() { message }: { message: string },
    @RequestUser() user: User,
  ) {
    return this.chatService.createMessage(
      {
        roomId,
        message,
      },
      user._id,
    );
  }

  @Get('/:roomId/message')
  getMessagePage(
    @Param() { roomId }: { roomId: ID },
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ) {
    return this.chatService.getMessagePage(roomId, { page, perPage });
  }

  @Patch('/:roomId/join')
  joinPublicRoom(
    @Param() { roomId }: { roomId: ID },
    @RequestUser() user: User,
  ) {
    return this.chatService.addUserToPublicRoom(roomId, user._id);
  }

  @Patch('/:roomId/leave')
  leaveRoom(@Param() { roomId }: { roomId: ID }, @RequestUser() user: User) {
    return this.chatService.leaveRoom(roomId, user._id);
  }
}
