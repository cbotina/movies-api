import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { MoviesService } from '../../src/movies/movies.service';
import { UsersService } from '../../src/users/users.service';
import { Rental } from './entities/rental.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RentalsService {
  constructor(
    private moviesService: MoviesService,
    private usersService: UsersService,
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
  ) {}

  async rentMovie(movieId: number, userId: number, days: number) {
    const movie = await this.moviesService.findOne(movieId);
    const user = await this.usersService.findOne(userId);

    const totalPrice = movie.rentPrice * days;

    if (movie.stock === 0) {
      throw new ConflictException(`Movie out of stock`);
    }

    if (!movie.availability) {
      throw new ServiceUnavailableException(`Movie not available`);
    }

    if (user.balance < totalPrice) {
      throw new BadRequestException(`Insufficient balance for purchase`);
    }

    const rentalDate = new Date();
    const dueDate = new Date(rentalDate);
    dueDate.setDate(rentalDate.getDate() + days);

    movie.stock -= 1;
    await this.moviesService.update(movieId, { ...movie });
    user.balance -= totalPrice;
    await this.usersService.update(userId, { ...user });

    const rental: CreateRentalDto = {
      user,
      movie,
      rentalDate,
      dueDate,
    };

    const createdRental = await this.rentalsRepository.save(rental);

    return createdRental;
  }

  async returnMovie(movieId: number, userId: number, rentalId: number) {
    const movie = await this.moviesService.findOne(movieId);
    const user = await this.usersService.findOne(userId);
    const rental = await this.rentalsRepository.findOneBy({
      movie,
      user,
      id: rentalId,
    });

    movie.stock++;
    await this.moviesService.update(movieId, { ...movie });

    rental.returnDate = new Date();

    const updatedRental = await this.rentalsRepository.save(rental);

    return updatedRental;
  }

  create(createRentalDto: CreateRentalDto) {
    return 'This action adds a new rental';
  }

  findAll() {
    return this.rentalsRepository.find({
      loadRelationIds: true,
    });
  }

  async findOne(id: number) {
    const rental = await this.rentalsRepository.findOne({
      relations: { movie: true, user: true },
      where: { id },
    });
    if (!rental) {
      throw new NotFoundException(`Rental #${id} not found`);
    }
    return rental;
  }

  update(id: number, updateRentalDto: UpdateRentalDto) {
    return `This action updates a #${id} rental`;
  }

  remove(id: number) {
    return `This action removes a #${id} rental`;
  }
}
