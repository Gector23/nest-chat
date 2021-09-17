import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { MessageType } from 'src/messages/enums/message-type.enum';
import { SimpleUserDto } from 'src/users/dto/simple.user.dto';
@Exclude()
export class MessageDto {
  @Expose()
  id: string;

  @Expose()
  text: string;

  @Transform(({ value }) =>
    value ? plainToClass(SimpleUserDto, value) : value,
  )
  @Expose()
  author: SimpleUserDto | null;

  @Expose()
  type: MessageType;
}
