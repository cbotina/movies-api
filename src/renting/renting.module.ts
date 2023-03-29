import { Module } from '@nestjs/common';
import { RentingService } from './renting.service';
import { RentingController } from './renting.controller';

@Module({
  controllers: [RentingController],
  providers: [RentingService]
})
export class RentingModule {}
