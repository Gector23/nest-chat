import { MessageType } from '../enums/message-type.enum';

export class MessageDto {
  type: MessageType;

  text: string;
}
