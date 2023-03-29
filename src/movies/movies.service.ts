import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const newMovie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(newMovie);
  }

  findAll() {
    return this.moviesRepository.find();
  }

  findOne(id: number) {
    return this.moviesRepository.findBy({ id });
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
    const exists = await this.moviesRepository.findOneBy({ id });

    if (!exists) {
      throw new NotFoundException(`Movie #${id} not found`);
    }
    return;
  }
}
