import { UserDto } from 'src/users/dto/user.dto';

export class SignInResDto {
  user: UserDto;
  accessToken: string;
}
