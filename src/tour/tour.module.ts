import { PrismaService } from './../prisma.service';
import { TourViewerController } from './controller/tour-viewer.controller';
import { Module } from '@nestjs/common';
import { TourService } from './tour.service';

@Module({
  controllers: [TourViewerController],
  providers: [TourService, PrismaService],
})
export class TourModule {}
