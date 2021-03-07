import { IsString, Length, MinLength } from 'class-validator';
import { ID } from '../../shared.types';

export class CreateMessageDTO {
  @MinLength(1)
  message: string
  @IsString()
  roomId: ID
}
