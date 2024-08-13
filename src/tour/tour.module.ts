import { Module } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { NativeMongoService } from './controller/native.mongo.service';
import { TourViewerController } from './controller/tour-viewer.controller';
import { TourService } from './tour.service';

@Module({
  controllers: [TourViewerController],
  providers: [TourService, CacheService, NativeMongoService],
  exports: [NativeMongoService, TourService],
})
export class TourModule {}
