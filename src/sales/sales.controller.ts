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
  ParseIntPipe,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { RequestWithUser } from 'src/common/interfaces/request-with-user';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/entities/user.entity';
import { Role } from 'src/common/decorators/roles.decorator';
import { BuyMoviesDto } from './dto/buy-movies.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Sales 💹')
@UseGuards(RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Role(Roles.CLIENT)
  @Post('buy/')
  buyTest(@Request() req: RequestWithUser, @Body() body: BuyMoviesDto) {
    return this.salesService.buyMovies(body.movies, req.user.id);
  }

  @Role(Roles.ADMIN)
  @Get('sales')
  findAll() {
    return this.salesService.findAll();
  }

  @Role(Roles.ADMIN)
  @ApiParam({ name: 'id', description: `Purchase id`, example: 1 })
  @Get('sales/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.findOne(+id);
  }

  @Role(Roles.CLIENT)
  @Get('mypurchases')
  mySales(@Request() req: RequestWithUser) {
    return this.salesService.findSalesByUser(req.user.id);
  }

  @Role(Roles.CLIENT)
  @ApiParam({ name: 'id', description: `Purchase id`, example: 1 })
  @Get('mypurchases/:id')
  mySale(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) purchaseId: number,
  ) {
    return this.salesService.findSaleByUser(req.user.id, purchaseId);
  }
}
