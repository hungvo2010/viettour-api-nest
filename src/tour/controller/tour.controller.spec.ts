import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TourViewerController } from './tour-viewer.controller';

describe('TourViewerController', () => {
  let controller: TourViewerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<TourViewerController>(TourViewerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
