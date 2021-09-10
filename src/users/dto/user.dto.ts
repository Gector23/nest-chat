import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  isAdmin: boolean;

  @Expose()
  isBlocked: boolean;

  @Expose()
  isMuted: boolean;
}
