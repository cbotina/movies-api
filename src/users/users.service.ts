import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles, User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    const { oldPassword, newPassword } = changePasswordDto;

    const checkPassword = compareSync(oldPassword, user.password);
    if (!checkPassword) {
      throw new UnauthorizedException('Wrong Password');
    }
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;

    this.usersRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const user = this.usersRepository.create(createUserDto);
    user.password = hashedPassword;

    const createdUser = this.usersRepository.save(user);
    return plainToInstance(User, createdUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return plainToInstance(User, user);
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, authUser: User) {
    if (updateUserDto.role && authUser.role !== Roles.ADMIN) {
      throw new UnauthorizedException(`Only admins can set user roles`);
    }
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    this.usersRepository.remove(user);
  }
}
