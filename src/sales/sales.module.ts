import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorsModule } from 'src/common/validators/validators.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [ValidatorsModule, MailModule, TypeOrmModule.forFeature([Sale])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
