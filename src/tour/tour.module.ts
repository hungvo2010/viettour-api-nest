import { NativeMongoService } from './controller/native.mongo.service';
import { PrismaService } from './../prisma.service';
import { TourViewerController } from './controller/tour-viewer.controller';
import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { CacheService } from 'src/cache/cache.service';

@Module({
  controllers: [TourViewerController],
  providers: [TourService, PrismaService, CacheService, NativeMongoService],
})
export class TourModule {}
