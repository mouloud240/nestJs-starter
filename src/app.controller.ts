import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Hello',
    description: 'Returns a simple "Hello World!" message.',
  })
  @ApiOkResponse({
    description: 'Returns "Hello World!".',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
