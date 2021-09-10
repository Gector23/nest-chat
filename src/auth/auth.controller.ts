import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { SignInResDto } from './dto/sign-in-res.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto): Promise<SignInResDto> {
    return this.authService.signIn(signInDto);
  }
}
