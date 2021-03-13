import { IsNotEmpty } from 'class-validator';
import { ID } from '../../shared.types';

export class SendInvitationDTO {
  @IsNotEmpty()
  recipient: ID;

  @IsNotEmpty()
  room: ID;
}
