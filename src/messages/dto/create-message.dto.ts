import { MessageType } from 'src/messages/enums/message-type.enum';
import { User } from 'src/users/user.entity';

export class CreateMessageDto {
  text: string;

  author: User | null;

  type: MessageType;
}
