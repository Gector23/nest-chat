import { plainToClass, Transform } from 'class-transformer';
import { MessageDto } from './message.dto';

export class MessagesDto {
  @Transform(({ value }) =>
    value.map((message) => plainToClass(MessageDto, message)),
  )
  messages: MessageDto[];

  page: number;

  pageSize: number;
}
