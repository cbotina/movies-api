import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Sale } from 'src/sales/entities/sale.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(email: string) {
    this.mailerService.sendMail({
      to: email,
      from: '"No Reply" <noreply@example.com>',
      subject: 'Hello',
      text: 'Hello world',
      html: '<b>welcome</>',
    });
  }

  async sendPurchaseDetails(purchases: Sale[]) {
    console.log(purchases);
    await this.mailerService.sendMail({
      to: purchases[0].user.email,
      subject: `Your purchase details`,
      template: './purchase-details',
      context: {
        purchases,
        user: purchases[0].user,
      },
    });
  }
}
