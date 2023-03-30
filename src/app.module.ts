import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { environments } from './config/environments';
import { dbConfig } from './config/db/database.config';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV], //searches in this file
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfig,
      inject: [ConfigService],
    }),
    MoviesModule,
    AuthModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
