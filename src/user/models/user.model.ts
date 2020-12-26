import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUser } from 'nest-modules';

@Schema()
export class UserModel extends BaseUser.BaseUserModel {
  @ApiProperty()
  @Prop()
  customProperty: string;
}
