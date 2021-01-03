import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseHelpers, BaseUser } from 'nest-modules';

enum TestEnum {
  Test1,
  Test2,
}

@Schema({ timestamps: true })
export class UserModel extends BaseUser.BaseUserModel {
  @ApiProperty(BaseHelpers.enumForSwagger(TestEnum, 'TestEnum'))
  @Prop()
  enumExample?: string;
}
