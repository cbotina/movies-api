import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles, User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  MockRepository,
  createMockRepository,
} from '../test/helpers/mock-repository';
import { MailService } from 'src/mail/mail.service';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;

  const randomUser: User = {
    id: 2,
    name: 'Random',
    surname: 'User',
    email: 'randomuser@gmail.com',
    role: Roles.CLIENT,
    balance: 0,
    rentals: [],
    sales: [],
  };
  const adminUser: User = {
    id: 1,
    name: 'Admin',
    surname: 'User',
    email: 'admin@gmail.com',
    role: Roles.ADMIN,
    balance: 0,
    rentals: [],
    sales: [],
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: MailService,
          useValue: { sendPasswordResetEmail: () => ({}) },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All Users', () => {
    it('should return an array of users', () => {
      const users = [];
      usersRepository.find.mockReturnValue(users);
      const result = service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('Create User', () => {
    it('should return the created user without password', async () => {
      const userDto: CreateUserDto = {
        name: 'Random',
        surname: 'User',
        email: 'randomuser@gmail.com',
        password: 'Abcd1234@',
        balance: 0,
      };

      usersRepository.create.mockReturnValue(userDto);

      const createdUser: User = {
        id: 1,
        name: 'Random',
        surname: 'User',
        email: 'randomuser@gmail.com',
        role: Roles.CLIENT,
        balance: 0,
        rentals: [],
        sales: [],
      };
      usersRepository.save.mockReturnValue(createdUser);
      const created = await service.create(userDto);

      expect(created).toEqual(createdUser);
    });
  });

  describe('Find User', () => {
    describe('When user exists', () => {
      it('should return a user', async () => {
        const userId = 1;
        const foundUser = randomUser;
        usersRepository.findOneBy.mockReturnValue(foundUser);
        const result = await service.findOne(userId);

        expect(result).toEqual(foundUser);
      });
    });

    describe('Otherwise', () => {
      it('should throw "NotFoundException"', async () => {
        const userId = 1;
        usersRepository.findOneBy.mockReturnValue(null);

        try {
          await service.findOne(userId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`User #${userId} not found`);
        }
      });
    });
  });

  describe('Update User', () => {
    describe('When user try to update itself', () => {
      it('should return the updated user', async () => {
        const idUser = 1;

        const updateUserDto: UpdateUserDto = {
          name: 'NewName',
        };

        const oldUser = randomUser;

        const updatedUser: User = {
          ...oldUser,
          ...updateUserDto,
        };

        usersRepository.preload.mockReturnValue(oldUser);
        usersRepository.save.mockReturnValue(updatedUser);

        const result = await service.update(idUser, updateUserDto, oldUser);

        expect(result).toEqual(updatedUser);
      });
    });

    describe('When user try to update its role', () => {
      it('should throw UnauthorizedException', async () => {
        const userId = 1;

        const updateUserDto: UpdateUserDto = {
          role: Roles.ADMIN,
        };

        const oldUser = randomUser;
        usersRepository.preload.mockReturnValue(oldUser);

        try {
          await service.update(userId, updateUserDto, oldUser);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual(`Only admins can set user roles`);
        }
      });
    });

    describe('When admin user try to update a role', () => {
      it(`should update user's role`, async () => {
        const userId = 2;

        const updateUserDto: UpdateUserDto = {
          role: Roles.ADMIN,
        };

        const oldUser = randomUser;

        const updatedUser: User = {
          ...oldUser,
          ...updateUserDto,
        };

        usersRepository.preload.mockReturnValue(updatedUser);

        usersRepository.preload.mockReturnValue(oldUser);
        usersRepository.save.mockReturnValue(updatedUser);

        const result = await service.update(userId, updateUserDto, adminUser);

        expect(result).toEqual(updatedUser);
      });
    });

    describe(`When user doesn't exists`, () => {
      it('should throw "NotFoundException"', async () => {
        const userId = 1;

        const updateUserDto: UpdateUserDto = {
          name: 'NewName',
        };

        usersRepository.preload.mockReturnValue(null);

        try {
          await service.update(userId, updateUserDto, new User());
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`User #${userId} not found`);
        }
      });
    });
  });

  describe('Delete User', () => {
    describe('When user exists', () => {
      it('should return nothing', async () => {
        const userId = 1;
        usersRepository.findOneBy.mockReturnValue({});
        usersRepository.remove.mockReturnValue(undefined);
        const result = await service.remove(userId);
        expect(result).toBe(undefined);
      });
    });
    describe('Otherwise', () => {
      it('should throw "NotFoundException"', async () => {
        const userId = 99;
        usersRepository.findOneBy.mockReturnValue(undefined);
        usersRepository.remove.mockReturnValue(undefined);
        try {
          await service.remove(userId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`User #${userId} not found`);
        }
      });
    });
  });

  describe('Change Password', () => {
    describe(`When user doesn't exists`, () => {
      it('should return NotFoundException', async () => {
        return;
      });
    });
    describe(`When user Exists`, () => {
      describe(`When oldPassword is correct`, () => {
        it(`should return a success message`, () => {
          return;
        });
      });
      describe(`When oldPassword is wrong`, () => {
        it(`should return UnauthorizedException`, async () => {
          return;
        });
      });
    });
  });

  describe('Request Reset Password', () => {
    const requestResetPasswordDto: RequestResetPasswordDto = {
      email: 'user@gmail.com',
    };
    describe('When user exists', () => {
      it('should return a message', async () => {
        usersRepository.findOneBy.mockReturnValue(new User());

        const response = {
          message: 'Check your email to continue reseting your password',
        };
        const result = await service.requestResetPassword(
          requestResetPasswordDto,
        );
        expect(result).toEqual(response);
      });
    });
    describe('Otherwise', () => {
      it('should throw NotFoundException', async () => {
        usersRepository.findOneBy.mockReturnValue(null);

        try {
          await service.requestResetPassword(requestResetPasswordDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('Reset Password', () => {
    const resetPasswordDto: ResetPasswordDto = {
      newPassword: '1234',
      token: '12341234',
    };
    it('should return a message', async () => {
      usersRepository.findOneBy.mockReturnValue(new User());
      usersRepository.save.mockReturnValue(new User());

      const result = await service.resetPassword(resetPasswordDto);
      const expectedResponse = { message: 'Password changed successfully' };

      expect(result).toEqual(expectedResponse);
    });
  });
});
