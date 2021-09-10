import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  login: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
