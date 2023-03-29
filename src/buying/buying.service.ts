import { Injectable } from '@nestjs/common';
import { CreateBuyingDto } from './dto/create-buying.dto';
import { UpdateBuyingDto } from './dto/update-buying.dto';

@Injectable()
export class BuyingService {
  create(createBuyingDto: CreateBuyingDto) {
    return 'This action adds a new buying';
  }

  findAll() {
    return `This action returns all buying`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buying`;
  }

  update(id: number, updateBuyingDto: UpdateBuyingDto) {
    return `This action updates a #${id} buying`;
  }

  remove(id: number) {
    return `This action removes a #${id} buying`;
  }
}
