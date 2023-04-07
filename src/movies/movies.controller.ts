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
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { Role } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { QueryFilterDto } from './dto/query-filters.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {
    this.parseArrayPipe = new ParseArrayPipe({
      items: String,
      separator: ',',
      optional: true,
    });
  }
  parseArrayPipe: ParseArrayPipe;

  @ApiTags('Movies 🎬')
  @ApiBearerAuth()
  @Post()
  @Role(Roles.ADMIN)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiTags('Tags 🏷️')
  @ApiBearerAuth()
  @ApiParam({ name: `movieId`, description: `Movie id`, example: 1 })
  @Post(':movieId/tags')
  @Role(Roles.ADMIN)
  addTagToMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createTagDto: CreateTagDto,
  ) {
    return this.moviesService.addTagToMovie(movieId, createTagDto);
  }

  @ApiTags('Movies 🎬')
  @Get()
  @Public()
  findAll(
    @Query()
    queryFilterDto: QueryFilterDto,
  ) {
    return this.moviesService.findAll(queryFilterDto);
  }

  @ApiTags('Movies 🎬')
  @Get(':id')
  @ApiParam({ name: 'id', description: `Movie's id`, example: 1 })
  @Public()
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.moviesService.findOne(+id);
  }

  @ApiTags('Movies 🎬')
  @ApiBearerAuth()
  @Patch(':id')
  @ApiParam({ name: 'id', description: `Movie's id`, example: 1 })
  @Role(Roles.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @ApiTags('Movies 🎬')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({ name: 'id', description: `Movie's id`, example: 1 })
  @Role(Roles.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @ApiBearerAuth()
  @ApiTags('Tags 🏷️')
  @ApiParam({ name: 'movieId', description: `Movie's id`, example: 1 })
  @ApiParam({ name: 'tagId', description: `Tag's id`, example: 1 })
  @Delete(':movieId/tags/:tagId')
  @Role(Roles.ADMIN)
  removeTagFromMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    return this.moviesService.removeTagFromMovie(movieId, tagId);
  }
}
