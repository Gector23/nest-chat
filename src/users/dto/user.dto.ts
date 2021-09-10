import { Exclude } from 'class-transformer';

export class UserDto {
  id: string;

  @Exclude()
  email: string;

  login: string;

  @Exclude()
  password: string;

  isAdmin: boolean;

  isBlocked: boolean;

  isMuted: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
