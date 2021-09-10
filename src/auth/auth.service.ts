import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInResDto } from './dto/sign-in-res.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResDto> {
    const { login, password } = signInDto;

    const user = await this.usersService.findUser({ login });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayloadInterface = {
        id: user.id,
      };
      const accessToken: string = await this.jwtService.sign(payload);
      return {
        user: plainToClass(UserDto, user),
        accessToken,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  signUp(createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }
}
