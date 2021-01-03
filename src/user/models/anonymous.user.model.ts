import { ApiProperty } from '@nestjs/swagger';

export class AnonymousUserModel {
  @ApiProperty()
  name: string;
  @ApiProperty()
  _id: string;
}
