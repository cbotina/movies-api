import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { hash } from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findOneByEmail: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Sign In', () => {
    const user = new User();
    const loginDto = new LoginDto();
    loginDto.email = 'example@gmail.com';

    describe('When password is wrong', () => {
      user.password = '1234';
      loginDto.password = '4321';
      it('should throw UnauthorizedException', async () => {
        jest
          .spyOn(usersService, 'findOneByEmail')
          .mockReturnValueOnce(new Promise((resolve) => resolve(user)));
        try {
          await service.signIn(loginDto);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual('Wrong Password');
        }
      });
    });

    describe('When password is correct', () => {
      it('should return payload', async () => {
        const signedJwt = 'th15is4jw7';
        loginDto.password = '1234';
        user.password = await hash('1234', 10);

        jest
          .spyOn(usersService, 'findOneByEmail')
          .mockReturnValueOnce(new Promise((resolve) => resolve(user)));

        jest.spyOn(jwtService, 'sign').mockReturnValueOnce(signedJwt);

        const expectedPayload = { token: signedJwt };

        const result = await service.signIn(loginDto);

        expect(result).toEqual(expectedPayload);
      });
    });
  });
});
