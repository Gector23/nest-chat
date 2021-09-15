import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityNotFoundError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const user = User.create(createUserDto);

      await user.save();

      return plainToClass(UserDto, user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException();
      }

      throw error;
    }
  }

  async findUser(where: { [key: string]: any }): Promise<User> {
    try {
      return User.findOneOrFail({ where });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async findUserById(id: string): Promise<UserDto> {
    const user = await this.findUser({ id });

    return plainToClass(UserDto, user);
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    const user = await this.findUser({ email });

    return plainToClass(UserDto, user);
  }

  async toggleMute(id: string): Promise<boolean> {
    const user = await this.findUser({ id });

    user.isMuted = !user.isMuted;

    await user.save();

    return user.isMuted;
  }

  async toggleBlock(id: string): Promise<void> {
    const user = await this.findUser({ id });

    user.isBlocked = !user.isBlocked;

    await user.save();
  }
}
