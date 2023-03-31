import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { BuyMovieValidator } from 'src/common/validators/buy-movie.validator';

@Injectable()
export class SalesService {
  constructor(
    private buyMovieValidator: BuyMovieValidator,
    private dataSource: DataSource,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  async buyMovie(movieId: number, userId: number, quantity: number) {
    const { validatedEntities, errors } = await this.buyMovieValidator.validate(
      movieId,
      userId,
    );
    if (errors.length > 0) {
      const { message, status } = errors[0];
      throw new HttpException(message, status);
    }
    const { user, movie } = validatedEntities;

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

  findOne(id: number) {
    return this.salesRepository.findOne({
      relations: { movie: true, user: true },
      where: { id },
    });
  }
}
