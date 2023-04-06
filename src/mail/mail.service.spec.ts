import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Sale } from 'src/sales/entities/sale.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { Rental, RentalStatus } from 'src/rentals/entities/rental.entity';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const movie = new Movie();
  const user = new User();

  describe('Send Purchase Email', () => {
    const purchases: Sale[] = [
      {
        datePurchased: new Date(),
        user,
        movie,
        quantity: 1,
      },
    ];
    it('should return void', async () => {
      await service.sendPurchaseDetails(purchases);
    });
  });

  describe('Send Rental Email', () => {
    const rentals: Rental[] = [
      {
        dueDate: new Date(),
        id: 1,
        movie,
        user,
        rentalDate: new Date(),
        status: RentalStatus.ACTIVE,
      },
    ];
    it('should return void', async () => {
      await service.sendRentalsDetails(rentals);
    });
  });

  describe('Send Purchase Email', () => {
    it('should return void', async () => {
      await service.sendPasswordResetEmail('', '', '');
    });
  });
});
