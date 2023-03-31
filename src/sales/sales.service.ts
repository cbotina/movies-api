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
import { CreateSaleDto } from './dto/create-sale.dto';

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

    movie.stock -= quantity;
    await this.moviesService.update(movieId, { ...movie });
    user.balance -= totalPrice;
    await this.usersService.update(userId, { ...user });

    const sale: CreateSaleDto = this.salesRepository.create({
      user,
      movie,
      quantity,
      datePurchased: new Date(),
    });

    const createdSale = await this.salesRepository.save(sale);

    return createdSale;
  }

  findAll() {
    return this.salesRepository.find({
      loadRelationIds: true,
    });
  }

  findOne(id: number) {
    return this.salesRepository.findOne({
      relations: { movie: true, user: true },
      where: { id },
    });
  }
}
