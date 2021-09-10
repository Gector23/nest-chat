import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(12)
  login: string;

  @MinLength(8)
  @MaxLength(16)
  password: string;
}
