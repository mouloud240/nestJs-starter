import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  checkout(quantity: number) {
    const totalPrice = quantity * 2500;
    console.log('Calling Satim api');
    return {
      totalPrice,
      transactionStatus: 'succefull',
    };
  }
}
