import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuyingService } from './buying.service';
import { CreateBuyingDto } from './dto/create-buying.dto';
import { UpdateBuyingDto } from './dto/update-buying.dto';

@Controller('buying')
export class BuyingController {
  constructor(private readonly buyingService: BuyingService) {}

  @Post()
  create(@Body() createBuyingDto: CreateBuyingDto) {
    return this.buyingService.create(createBuyingDto);
  }

  @Get()
  findAll() {
    return this.buyingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyingDto: UpdateBuyingDto) {
    return this.buyingService.update(+id, updateBuyingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyingService.remove(+id);
  }
}
