import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
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

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.salesService.findOne(+id);
  }
}
