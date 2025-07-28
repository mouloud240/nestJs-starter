import { Test, TestingModule } from '@nestjs/testing';
import { SacrificeVideoController } from './sacrifice-video.controller';
import { SacrificeVideoService } from './sacrifice-video.service';

describe('SacrificeVideoController', () => {
  let controller: SacrificeVideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SacrificeVideoController],
      providers: [SacrificeVideoService],
    }).compile();

    controller = module.get<SacrificeVideoController>(SacrificeVideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
