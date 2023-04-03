import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleBodyDto } from './dto/buy-movie-body';
import { RequestWithUser } from 'src/common/interfaces/request-with-user';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/entities/user.entity';
import { Role } from 'src/common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Role(Roles.CLIENT)
  @Post('buy/:movieId')
  buy(
    @Param('movieId') movieId: number,
    @Request() req: RequestWithUser,
    @Body() body: CreateSaleBodyDto,
  ) {
    return this.salesService.buyMovie(movieId, req.user.id, body.quantity);
  }

  @Role(Roles.ADMIN)
  @Get('sales')
  findAll() {
    return this.salesService.findAll();
  }
  @Role(Roles.ADMIN)
  @Get('sales/:id')
  findOne(@Param('id') id: number) {
    return this.salesService.findOne(+id);
  }
}
