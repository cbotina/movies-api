import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturningService } from './returning.service';
import { CreateReturningDto } from './dto/create-returning.dto';
import { UpdateReturningDto } from './dto/update-returning.dto';

@Controller('returning')
export class ReturningController {
  constructor(private readonly returningService: ReturningService) {}

  @Post()
  create(@Body() createReturningDto: CreateReturningDto) {
    return this.returningService.create(createReturningDto);
  }

  @Get()
  findAll() {
    return this.returningService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returningService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReturningDto: UpdateReturningDto) {
    return this.returningService.update(+id, updateReturningDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returningService.remove(+id);
  }
}
