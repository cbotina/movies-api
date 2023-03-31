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
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentMovieDto } from './dto/rent-movie-body.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ReturnMovieDto } from './dto/return-movie.dto';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('rent/:movieId')
  rentMovie(
    @Param('movieId') movieId: number,
    @Request() req: RequestWithUser,
    @Body() body: RentMovieDto,
  ) {
    return this.rentalsService.rentMovie(movieId, req.user.id, body.days);
  }

  @UseGuards(JwtAuthGuard)
  @Post('return/:movieId')
  returnMovie(
    @Param('movieId') movieId: number,
    @Request() req: RequestWithUser,
    @Body() body: ReturnMovieDto,
  ) {
    return this.rentalsService.returnMovie(movieId, req.user.id, body.idRental);
  }

  @Post()
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rentalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalsService.update(+id, updateRentalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(+id);
  }
}
