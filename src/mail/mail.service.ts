import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Sale } from 'src/sales/entities/sale.entity';
import { Rental } from 'src/rentals/entities/rental.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPurchaseDetails(purchases: Sale[]) {
    await this.mailerService.sendMail({
      to: purchases[0].user.email,
      subject: `Your purchase details`,
      template: './purchases-details',
      context: {
        purchases,
        user: purchases[0].user,
        date: purchases[0].datePurchased,
      },
    });
  }

  async sendRentalsDetails(rentals: Rental[]) {
    await this.mailerService.sendMail({
      to: rentals[0].user.email,
      subject: `Your purchase details`,
      template: './rentals-details',
      context: {
        rentals,
        user: rentals[0].user,
        date: rentals[0].rentalDate,
      },
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Reset Password`,
      template: './change-password-instructions',
      context: {
        name,
        token,
        url: 'http://localhost:3000/reset-password',
      },
    });
  }
}
