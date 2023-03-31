import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { UsersModule } from 'src/users/users.module';
import { MoviesModule } from 'src/movies/movies.module';
import { Sale } from './entities/sale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Module({
  imports: [UsersModule, MoviesModule, TypeOrmModule.forFeature([Sale])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
