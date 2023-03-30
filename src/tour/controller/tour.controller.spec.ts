import { Test, TestingModule } from '@nestjs/testing';
import { TourService } from '../tour.service';
import { TourViewerController } from './tour-viewer.controller';

describe('TourViewerController', () => {
  let controller: TourViewerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourViewerController],
      providers: [TourService],
    }).compile();

    controller = module.get<TourViewerController>(TourViewerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
