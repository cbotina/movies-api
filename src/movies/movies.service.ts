import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { plainToInstance } from 'class-transformer';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import {
  getOrderObject,
  getWhereQueryObject,
  validateSortOptions,
} from './utils/utils';
import { QueryFilterDto } from './dto/query-filters.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const newMovie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(newMovie);
  }

  findAll(queryFilterDto: QueryFilterDto) {
    console.log(queryFilterDto);
    const sortOptions = queryFilterDto.sort ?? ['title'];

    const { errors, validOptions } = validateSortOptions(sortOptions);

    if (errors.length > 0) {
      throw new BadRequestException(errors[0]);
    }

    const orderObject = getOrderObject(validOptions);
    const whereObject = getWhereQueryObject(queryFilterDto);

    return this.moviesRepository.find({
      order: orderObject,
      where: whereObject,
    });
  }

  async findOne(id: number) {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
    if (!movie) {
      throw new NotFoundException(`Movie #${id} not found`);
    }
    return plainToInstance(Movie, movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const updatedMovie = await this.moviesRepository.preload({
      id,
      ...updateMovieDto,
    });

    if (!updatedMovie) {
      throw new NotFoundException(`Movie #${id} not found`);
    }
    return this.moviesRepository.save(updatedMovie);
  }

  async remove(id: number) {
    const movie = await this.moviesRepository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException(`Movie #${id} not found`);
    }

    this.moviesRepository.remove(movie);
  }

  async addTagToMovie(movieId: number, createTagDto: CreateTagDto) {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: { tags: true },
    });

    let tag: Tag = await this.tagsRepository.findOneBy(createTagDto);

    if (!tag) {
      tag = await this.tagsRepository.save(createTagDto);
    }

    movie.tags.push(tag);
    const updatedMovie = await this.moviesRepository.save(movie);
    return updatedMovie;
  }

  async removeTagFromMovie(movieId: number, tagId: number) {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: { tags: true },
    });

    movie.tags = movie.tags.filter((tag) => tag.id !== tagId);

    const updatedMovie = await this.moviesRepository.save(movie);
    return updatedMovie;
  }
}
