import { Test, TestingModule } from '@nestjs/testing';
import { SacrificeService } from './sacrifice.service';

describe('SacrificeService', () => {
  let service: SacrificeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SacrificeService],
    }).compile();

    service = module.get<SacrificeService>(SacrificeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
