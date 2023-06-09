import { PrismaService } from './../prisma.service';
import { TourViewerController } from './controller/tour-viewer.controller';
import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [TourViewerController],
  providers: [TourService, PrismaService, RedisService],
})
export class TourModule {}
