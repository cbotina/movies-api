import { Module } from '@nestjs/common';
import { ReturningService } from './returning.service';
import { ReturningController } from './returning.controller';

@Module({
  controllers: [ReturningController],
  providers: [ReturningService]
})
export class ReturningModule {}
