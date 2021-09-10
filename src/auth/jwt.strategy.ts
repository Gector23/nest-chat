import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: process.env.ACCESS_KEY_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserDto> {
    const user = await this.usersService.findUser({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return plainToClass(UserDto, user);
  }
}
