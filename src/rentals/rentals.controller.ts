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
  HttpCode,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentMovieDto } from './dto/rent-movie-body.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user';
import { ReturnMovieDto } from './dto/return-movie.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/entities/user.entity';
import { Role } from 'src/common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post('rent/:movieId')
  rentMovie(
    @Param('movieId') movieId: number,
    @Request() req: RequestWithUser,
    @Body() body: RentMovieDto,
  ) {
    return this.rentalsService.rentMovie(movieId, req.user.id, body.days);
  }

  @HttpCode(200)
  @Post('return/:movieId')
  returnMovie(
    @Param('movieId') movieId: number,
    @Request() req: RequestWithUser,
    @Body() body: ReturnMovieDto,
  ) {
    return this.rentalsService.returnMovie(movieId, req.user.id, body.idRental);
  }

  @Role(Roles.ADMIN)
  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Role(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rentalsService.findOne(id);
  }
}
