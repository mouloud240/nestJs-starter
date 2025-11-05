import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello to core app';
  }
}
