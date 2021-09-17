import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const message = Message.create(createMessageDto);

    await message.save();

    return plainToClass(MessageDto, message);
  }
}
