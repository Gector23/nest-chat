import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SimpleUserDto {
  @Expose()
  id: string;

  @Expose()
  login: string;
}
