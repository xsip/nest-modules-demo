import { Module } from '@nestjs/common';
import { UnoService } from './uno.service';

@Module({
  providers: [UnoService],
  exports: [UnoService],
})
export class UnoModule {}
