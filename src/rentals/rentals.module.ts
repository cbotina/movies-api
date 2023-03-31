import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { UsersModule } from 'src/users/users.module';
import { ValidatorsModule } from 'src/common/validators/validators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental]),
    MoviesModule,
    UsersModule,
    ValidatorsModule,
  ],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
