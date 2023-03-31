import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Post(':movieId/tags')
  addTagToMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createTagDto: CreateTagDto,
  ) {
    return this.moviesService.addTagToMovie(movieId, createTagDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @Delete(':movieId/tags/:tagId')
  removeTagFromMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    return this.moviesService.removeTagFromMovie(movieId, tagId);
  }
}
