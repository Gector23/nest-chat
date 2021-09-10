import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  login: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
