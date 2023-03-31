import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { MoviesService } from 'src/movies/movies.service';
import { UsersService } from 'src/users/users.service';
import { Rental } from './entities/rental.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RentMovieValidator } from 'src/common/validators/rent-movie.validator';

@Injectable()
export class RentalsService {
  constructor(
    private moviesService: MoviesService,
    private usersService: UsersService,
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
    // // ? Validation //

    // // check movie
    // const movie = await this.moviesService.findOne(movieId);

    // // validate movie
    // if (movie.stock === 0) {
    //   throw new ConflictException(`Movie out of stock`);
    // }

    // if (!movie.availability) {
    //   throw new ServiceUnavailableException(`Movie not available`);
    // }

    // // check user
    // const user = await this.usersService.findOne(userId);

    // const totalPrice = movie.rentPrice * days;
    // if (user.balance < totalPrice) {
    //   throw new BadRequestException(`Insufficient balance for purchase`);
    // }

    // ? Transaction  //

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const totalPrice = movie.rentPrice * days;
      if (user.balance < totalPrice) {
        throw new BadRequestException(`Insufficient balance for purchase`);
      }

      // update movie
      movie.stock -= 1;
      await queryRunner.manager.save(movie);
      //await this.moviesService.update(movieId, { ...movie });

      // update user
      user.balance -= totalPrice;
      await queryRunner.manager.save(user);
      // await this.usersService.update(userId, { ...user });

      // build rental
      const rentalDate = new Date();
      const dueDate = new Date(rentalDate);
      dueDate.setDate(rentalDate.getDate() + days);

      // const rental: CreateRentalDto = {
      //   user,
      //   movie,
      //   rentalDate,
      //   dueDate,
      // };
      //save rental
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
    // ? Validation //

    // check movie
    const movie = await this.moviesService.findOne(movieId);

    // ! no validate movie

    // check user
    const user = await this.usersService.findOne(userId);

    // ! no validate user

    // ? Transaction //
    // update movie
    movie.stock++;
    await this.moviesService.update(movieId, { ...movie });

    // ! no update user

    // build rental
    const rental = await this.rentalsRepository.findOneBy({
      movie,
      user,
      id: rentalId,
    });
    rental.returnDate = new Date();

    // save rental

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
