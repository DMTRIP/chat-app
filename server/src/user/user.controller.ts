import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSearchQuery } from './user-search.query';
import { CurrentUser } from '../decorators/user.decorator';
import { CreateMessageDTO } from '../chat/dto/create-message-dto';
import { User } from './user.schema';
import { ID } from '../shared.types';
import { SendInvitationDTO } from './dto/send-invitation.dto';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/search')
  search(@Query() query: UserSearchQuery) {
    return this.userService.search(query);
  }

  @Get('/rooms')
  getRooms(@CurrentUser() user: User) {
    return this.userService.getRooms(user._id);
  }

  @Post('/:recipientId/message')
  sendDirectMessage(
    @Param() { recipientId }: { recipientId: ID },
    @CurrentUser() user: User,
    @Body() createMessageDto: CreateMessageDTO,
  ) {
    return this.userService.sendDirectMessage({
      ...createMessageDto,
      senderId: user._id,
      recipientId,
    });
  }

  @Get('/:id')
  getOne(@Param() { id }: { id: ID }) {
    return this.userService.getOne(id);
  }

  @Post('/invitation')
  sendInvitation(@Body() data: SendInvitationDTO, @CurrentUser() user) {
    return this.userService.sendInvitation(user._id, data);
  }
}
