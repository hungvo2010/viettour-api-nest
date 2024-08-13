import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from 'src/cache/cache.service';
import { MetricsService } from 'src/metrics/metric.service';
import { PrismaService } from 'src/prisma.service';
import { NativeMongoService } from 'src/tour/controller/native.mongo.service';
import { TourService } from 'src/tour/tour.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        PrismaService,
        TourService,
        UsersService,
        CacheService,
        MetricsService,
        { provide: CACHE_MANAGER, useValue: {} },
        NativeMongoService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
