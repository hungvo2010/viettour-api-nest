import {
  CacheInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TourService } from '../tour.service';

@Controller('/v1.0/tours/')
export class TourViewerController {
  constructor(private readonly tourService: TourService) {}
  private readonly logger = new Logger(TourViewerController.name);

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async getTour(@Param('id') tourId: string) {
    const vrTour = await this.tourService.findOne(tourId);
    return {
      item: vrTour,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getTourByEncodeUrl(@Query('encodeUrl') encodeUrl: string) {
    const vrTour = await this.tourService.findByEncodeUrl(encodeUrl);
    return {
      item: vrTour,
      timestamp: new Date().toISOString(),
    };
  }
}
