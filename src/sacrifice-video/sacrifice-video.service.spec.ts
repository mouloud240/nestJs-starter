import { Test, TestingModule } from '@nestjs/testing';
import { SacrificeVideoService } from './sacrifice-video.service';

describe('SacrificeVideoService', () => {
  let service: SacrificeVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SacrificeVideoService],
    }).compile();

    service = module.get<SacrificeVideoService>(SacrificeVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
