import { Test, TestingModule } from '@nestjs/testing';
import { HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';

describe('HostelController', () => {
  let controller: HostelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostelController],
      providers: [HostelService],
    }).compile();

    controller = module.get<HostelController>(HostelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
