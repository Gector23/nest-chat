import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { MessagesDto } from './dto/messages.dto';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const message = Message.create(createMessageDto);

    await message.save();

    return plainToClass(MessageDto, message);
  }

  async getMessages(
    currentPage: number,
    pageSize: number,
  ): Promise<MessagesDto> {
    const messages = await Message.find({
      relations: ['author'],
      skip: pageSize * (currentPage - 1),
      take: pageSize,
    });

    return plainToClass(MessagesDto, {
      messages,
      page: currentPage,
      pageSize,
    });
  }
}
