import { IsArray, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ID } from '../../shared.types';
import { RoomType } from '../types';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsEnum(RoomType)
  type: RoomType;

  @MinLength(1, { each: true })
  userIds: ID[];
}
