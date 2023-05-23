import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { TourService } from '../tour.service';

@Controller('/v1.0/tours/')
export class TourViewerController {
  constructor(private readonly tourService: TourService) {}
  private readonly logger = new Logger(TourViewerController.name);

  @Get(':id')
  async getTour(@Param('id') tourId: string) {
    const vrTour = await this.tourService.findOne(tourId);
    return {
      item: vrTour,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async getTourByEncodeUrl(@Query('encodeUrl') encodeUrl: string) {
    const vrTour = await this.tourService.findByEncodeUrl(encodeUrl);
    return {
      item: vrTour,
      timestamp: new Date().toISOString(),
    };
  }
}
