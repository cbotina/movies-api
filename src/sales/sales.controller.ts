import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { CreateSaleBodyDto } from './dto/create-sale-body.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('buy')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':movieId')
  buy(
    @Param('movieId') movieId: number,
    @Request() req: any,
    @Body() body: CreateSaleBodyDto,
  ) {
    return this.salesService.buyMovie(movieId, req.user.id, body.quantity);
  }

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
