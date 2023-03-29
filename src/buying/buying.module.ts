import { Module } from '@nestjs/common';
import { BuyingService } from './buying.service';
import { BuyingController } from './buying.controller';

@Module({
  controllers: [BuyingController],
  providers: [BuyingService]
})
export class BuyingModule {}
