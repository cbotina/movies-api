import { NotFoundException } from '@nestjs/common';
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

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All Users', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
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
        const foundUser: User = {
          id: userId,
          name: 'Random',
          surname: 'User',
          email: 'randomuser@gmail.com',
          balance: 0,
          rentals: [],
          sales: [],
          role: Roles.CLIENT,
        };

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
    describe('When user exists', () => {
      it('should return the updated user', async () => {
        const idUser = 1;

        const updateUserDto: UpdateUserDto = {
          name: 'NewName',
        };

        const oldUser: User = {
          id: idUser,
          name: 'Random',
          surname: 'User',
          password: '1234',
          email: 'randomuser@gmail.com',
          balance: 0,
          rentals: [],
          sales: [],
          role: Roles.CLIENT,
        };

        const updatedUser: User = {
          ...oldUser,
          ...updateUserDto,
        };

        usersRepository.preload.mockReturnValue(oldUser);
        usersRepository.save.mockReturnValue(updatedUser);
        //const result = await service.update(idUser, updateUserDto);

        //expect(result).toEqual(updatedUser);
      });
    });

    describe('Otherwise', () => {
      it('should throw "NotFoundException"', async () => {
        const userId = 1;

        const updateUserDto: UpdateUserDto = {
          name: 'NewName',
        };

        usersRepository.preload.mockReturnValue(null);

        try {
          // await service.update(userId, updateUserDto);
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
});
