import {
  BadRequestException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoviesService } from 'src/movies/movies.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesService {
  constructor(
    private moviesService: MoviesService,
    private usersService: UsersService,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  async buyMovie(movieId: number, userId: number, quantity: number) {
    const movie = await this.moviesService.findOne(movieId);
    const user = await this.usersService.findOne(userId);
    const totalPrice = movie.salePrice * quantity;

    if (movie.stock === 0) {
      throw new ConflictException(`Movie out of stock`);
    }

    if (!movie.availability) {
      throw new ServiceUnavailableException(`Movie not available`);
    }

    if (user.balance < totalPrice) {
      throw new BadRequestException(`Insufficient balance for purchase`);
    }

    const purchase = this.salesRepository.create({
      user,
      movie,
      quantity,
      datePurchased: '2023-03-30',
    });

    console.log(purchase);

    const sale = this.salesRepository.create(purchase);
    const createdSale = await this.salesRepository.save(sale);
    await this.moviesService.update(movieId, {
      stock: (movie.stock -= quantity),
    });
    await this.usersService.update(userId, {
      balance: user.balance - totalPrice,
    });

    return createdSale;
  }

  findAll() {
    return this.salesRepository.find({
      relations: {
        movie: true,
        user: true,
      },
      select: {
        movie: {
          title: true,
        },
        user: {
          email: true,
        },
      },
    });
  }

  findOne(id: number) {
    return this.salesRepository.findOne({
      relations: { movie: true, user: true },
      where: { id },
    });
  }
}
