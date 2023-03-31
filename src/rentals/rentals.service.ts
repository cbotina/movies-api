import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Rental } from './entities/rental.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RentMovieValidator } from 'src/common/validators/rent-movie.validator';
import { RentalStatus } from './entities/rental.entity';

@Injectable()
export class RentalsService {
  constructor(
    private rentMovieValidator: RentMovieValidator,
    private dataSource: DataSource,
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
  ) {}

  async rentMovie(movieId: number, userId: number, days: number) {
    const { validatedEntities, errors } =
      await this.rentMovieValidator.validate(movieId, userId);
    if (errors.length > 0) {
      const { message, status } = errors[0];
      throw new HttpException(message, status);
    }
    const { user, movie } = validatedEntities;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const totalPrice = movie.rentPrice * days;
      if (user.balance < totalPrice) {
        throw new BadRequestException(`Insufficient balance for purchase`);
      }

      movie.stock -= 1;
      await queryRunner.manager.save(movie);

      user.balance -= totalPrice;
      await queryRunner.manager.save(user);

      const rentalDate = new Date();
      const dueDate = new Date(rentalDate);
      dueDate.setDate(rentalDate.getDate() + days);

      const rental = await this.rentalsRepository.create({
        user,
        movie,
        rentalDate,
        dueDate,
      });

      const createdRental = await queryRunner.manager.save(rental);

      await queryRunner.commitTransaction();

      return createdRental;
    } catch (err) {
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async returnMovie(movieId: number, userId: number, rentalId: number) {
    const { validatedEntities, errors } =
      await this.rentMovieValidator.validate(movieId, userId);
    if (errors.length > 0) {
      const { message, status } = errors[0];
      throw new HttpException(message, status);
    }

    const { user, movie } = validatedEntities;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      movie.stock++;
      await queryRunner.manager.save(movie);

      const rental = await this.rentalsRepository.findOneBy({
        id: rentalId,
      });

      rental.returnDate = new Date();
      rental.status = RentalStatus.RETURNED;

      const updatedRental = await queryRunner.manager.save(rental);

      await queryRunner.commitTransaction();

      return updatedRental;
    } catch (err) {
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
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
}
