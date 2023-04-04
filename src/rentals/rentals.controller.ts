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
  ParseIntPipe,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentMovieDto } from './dto/rent-movie-body.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user';
import { ReturnMovieDto } from './dto/return-movie.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/entities/user.entity';
import { Role } from 'src/common/decorators/roles.decorator';
import { RentMoviesDto } from './dto/rent-movies.dto';

@UseGuards(RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post('rent')
  rentMovies(@Body() body: RentMoviesDto, @Request() req: RequestWithUser) {
    return this.rentalsService.rentMovies(body.movies, req.user.id);
  }

  @HttpCode(200)
  @Post('return')
  returnMovie(@Request() req: RequestWithUser, @Body() body: ReturnMovieDto) {
    return this.rentalsService.returnMovie(req.user.id, body.idRental);
  }

  @Role(Roles.ADMIN)
  @Get('rentals')
  findAll() {
    return this.rentalsService.findAll();
  }

  @Role(Roles.ADMIN)
  @Get('rentals/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findOne(id);
  }

  @Role(Roles.CLIENT)
  @Get('myrentals')
  myRentals(@Request() req: RequestWithUser) {
    return this.rentalsService.findRentalsByUser(req.user.id);
  }

  @Role(Roles.CLIENT)
  @Get('myrentals/:rentalId')
  myRental(
    @Request() req: RequestWithUser,
    @Param('rentalId', ParseIntPipe) rentalId: number,
  ) {
    return this.rentalsService.findRentalByUser(req.user.id, rentalId);
  }
}
