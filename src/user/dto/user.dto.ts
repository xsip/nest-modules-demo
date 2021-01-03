import { ApiProperty } from '@nestjs/swagger';

export class AnonymousLoginDto {
  @ApiProperty()
  name: string;
}

export class LoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class RegisterDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  name: string;
}
