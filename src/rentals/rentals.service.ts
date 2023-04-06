import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Rental } from './entities/rental.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RentalStatus } from './entities/rental.entity';
import { RentalOrder } from './dto/rent-movies.dto';
import { MoviesValidator } from 'src/common/validators/movies-validator';
import { Order } from 'src/common/validators/entities/order.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class RentalsService {
  constructor(
    private moviesValidator: MoviesValidator,
    private dataSource: DataSource,
    private mailService: MailService,
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
  ) {}

  async rentMovies(rentals: RentalOrder[], userId: number) {
    const orders: Order[] = rentals.map((rental) => ({
      movieId: rental.movieId,
      amount: rental.days,
    }));
    const { user, movieObjects, errors } = await this.moviesValidator.validate(
      orders,
      userId,
    );

    if (errors.length > 0) {
      const { message, status } = errors[0];
      throw new HttpException(message, status);
    }

    const response = [];

    for (const movieObject of movieObjects) {
      const { movie, amount } = movieObject;
      response.push(await this.rentMovieTransaction(movie, user, amount));
    }

    await this.mailService.sendRentalsDetails(response);

    return response;
  }

  async rentMovieTransaction(movie: Movie, user: User, days: number) {
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

  async returnMovie(userId: number, rentalId: number) {
    const rental = await this.rentalsRepository.findOne({
      relations: {
        movie: true,
      },
      where: {
        id: rentalId,
        user: { id: userId },
      },
    });

    if (!rental) {
      throw new NotFoundException(`Rental not found`);
    }

    const { movie } = rental;

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

  findRentalsByUser(userId: number) {
    return this.rentalsRepository.find({
      loadRelationIds: true,
      where: {
        user: { id: userId },
      },
    });
  }

  async findRentalByUser(userId: number, rentalId: number) {
    const rental = await this.rentalsRepository.findOne({
      relations: { movie: true, user: true },
      where: {
        id: rentalId,
        user: { id: userId },
      },
    });
    if (!rental) {
      throw new NotFoundException();
    }
    return rental;
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
