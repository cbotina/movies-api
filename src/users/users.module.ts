import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([User, Sale])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
