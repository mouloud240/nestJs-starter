import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  controllers: [DonationController],
  providers: [DonationService],
  imports: [PaymentModule],
})
export class DonationModule {}
