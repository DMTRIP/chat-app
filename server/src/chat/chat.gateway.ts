import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Room } from './schemas/room.schema';
import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { ID } from '../shared.types';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('userMessageToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('userMessageToServer', payload);
  }

  emitNewRoom(room: Room) {
    this.server.emit('newRoom', room);
  }

  emitNewMessage(message: Message) {
    this.server.emit('newMessage', message);
  }

  emitLeaveRoom(roomId: ID, userId: ID) {
    this.server.emit('leaveRoom', { roomId, userId });
  }

  emitJoinRoom(roomId: ID, userId: ID) {
    this.server.emit('joinRoom', { roomId, userId });
  }

  handleConnection(client: Socket, ...args: any): any {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('userConnection', { id: client.id });
  }

  handleDisconnect(client: any): any {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('userDisconnect', { id: client.id });
  }
}
