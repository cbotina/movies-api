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
import { CreateSaleBodyDto } from './dto/buy-movie-body';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user';

@Controller('buy')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':movieId')
  buy(
    @Param('movieId') movieId: number,
    @Request() req: RequestWithUser,
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
