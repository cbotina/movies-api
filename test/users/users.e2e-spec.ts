import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../src/config/configuration';
import { environments } from '../../src/config/environments';
import { dbConfig } from '../../src/config/db/database.config';
import { UsersModule } from '../../src/users/users.module';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

describe('[Feature] Users - /users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        stopAtFirstError: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('Create [POST /]', async () => {
    const user: CreateUserDto = {
      name: 'Random',
      surname: 'User',
      username: 'randomuser',
      email: 'randomuser@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(user);

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body.email).toEqual('randomuser@gmail.com');
  });

  it.todo('Get all [GET /]');
  it.todo('Get one [GET /]');
  it.todo('Update one [PATCH /]');
  it.todo('Delete one [DELETE /]');

  afterAll(async () => {
    await app.close();
  });
});
