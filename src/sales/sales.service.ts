import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { BuyMovieValidator } from 'src/common/validators/buy-movie.validator';
import { BuyMoviesDto, Purchase } from './dto/buy-movies.dto';
import { MoviesValidator } from 'src/common/validators/movies-validator';
import { User } from 'src/users/entities/user.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class SalesService {
  constructor(
    private buyMovieValidator: BuyMovieValidator,
    private moviesValidator: MoviesValidator,
    private dataSource: DataSource,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  async buyMovies(purchases: Purchase[], userId: number) {
    const { user, movieObjects, errors } = await this.moviesValidator.validate(
      purchases,
      userId,
    );
    if (errors.length > 0) {
      const { message, status } = errors[0];
      throw new HttpException(message, status);
    }

    const response = [];
    for (const movieObject of movieObjects) {
      const { movie, quantity } = movieObject;
      response.push(await this.buyMovieTransaction(movie, user, quantity));
    }

    return response;
  }

  async buyMovieTransaction(movie: Movie, user: User, quantity: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const totalPrice = movie.rentPrice * quantity;
      if (user.balance < totalPrice) {
        throw new BadRequestException(`Insufficient balance for purchase`);
      }

      movie.stock -= quantity;
      await queryRunner.manager.save(movie);

      user.balance -= totalPrice;
      await queryRunner.manager.save(user);
      const sale = this.salesRepository.create({
        user,
        movie,
        quantity,
        datePurchased: new Date(),
      });
      const createdSale = await queryRunner.manager.save(sale);
      await queryRunner.commitTransaction();
      return createdSale;
    } catch (err) {
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.salesRepository.find({
      loadRelationIds: true,
    });
  }

  findSalesByUser(userId: number) {
    return this.salesRepository.find({
      loadRelationIds: true,
      where: {
        user: { id: userId },
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
