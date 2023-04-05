import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { ValidatorsModule } from 'src/common/validators/validators.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rental]), ValidatorsModule, MailModule],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
