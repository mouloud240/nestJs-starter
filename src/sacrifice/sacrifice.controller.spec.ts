import { Test, TestingModule } from '@nestjs/testing';
import { SacrificeController } from './sacrifice.controller';
import { SacrificeService } from './sacrifice.service';

describe('SacrificeController', () => {
  let controller: SacrificeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SacrificeController],
      providers: [SacrificeService],
    }).compile();

    controller = module.get<SacrificeController>(SacrificeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
