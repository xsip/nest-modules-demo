import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseHelpers, BaseUser } from 'nest-modules';

enum TestEnum {
  Test1,
  Test2,
}

class TelegramData {
  @ApiProperty()
  @Prop()
  id?: number;

  @ApiProperty()
  @Prop()
  is_bot?: boolean;

  @ApiProperty()
  @Prop()
  first_name?: string;

  @ApiProperty()
  @Prop()
  username?: string;

  @ApiProperty()
  @Prop()
  language_code?: string;
}

@Schema({ timestamps: true })
export class UserModel extends BaseUser.BaseUserModel {
  @ApiProperty(BaseHelpers.enumForSwagger(TestEnum, 'TestEnum'))
  @Prop()
  enumExample?: string;

  @ApiProperty()
  @Prop()
  tfa?: boolean;

  @ApiProperty()
  @Prop()
  twoFactorActivationCode?: number;

  @ApiProperty()
  @Prop()
  twoFactorCode?: number;

  @ApiProperty()
  @Prop()
  twoFactorExpires?: number;

  @ApiProperty()
  @Prop()
  telegramUserId?: number;

  @ApiProperty({ type: TelegramData })
  @Prop()
  telegramData: TelegramData;
}
