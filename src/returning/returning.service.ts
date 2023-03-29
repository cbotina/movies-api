import { Injectable } from '@nestjs/common';
import { CreateReturningDto } from './dto/create-returning.dto';
import { UpdateReturningDto } from './dto/update-returning.dto';

@Injectable()
export class ReturningService {
  create(createReturningDto: CreateReturningDto) {
    return 'This action adds a new returning';
  }

  findAll() {
    return `This action returns all returning`;
  }

  findOne(id: number) {
    return `This action returns a #${id} returning`;
  }

  update(id: number, updateReturningDto: UpdateReturningDto) {
    return `This action updates a #${id} returning`;
  }

  remove(id: number) {
    return `This action removes a #${id} returning`;
  }
}
