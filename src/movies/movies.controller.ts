import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { Role } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/users/entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';

@UseGuards(RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Role(Roles.ADMIN)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Post(':movieId/tags')
  @Role(Roles.ADMIN)
  addTagToMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createTagDto: CreateTagDto,
  ) {
    return this.moviesService.addTagToMovie(movieId, createTagDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @Role(Roles.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @Role(Roles.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @Delete(':movieId/tags/:tagId')
  @Role(Roles.ADMIN)
  removeTagFromMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    return this.moviesService.removeTagFromMovie(movieId, tagId);
  }
}
