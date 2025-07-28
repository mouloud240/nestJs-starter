import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a simple "Hello World!" message.
   * @returns {string} The "Hello World!" message.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
