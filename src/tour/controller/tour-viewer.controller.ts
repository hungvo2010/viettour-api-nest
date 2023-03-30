import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { TourService } from '../tour.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('/v1.0/tour/')
@UseGuards(JwtAuthGuard)
export class TourViewerController {
  constructor(private readonly tourService: TourService) {}
  private readonly logger = new Logger(TourViewerController.name);

  @Get(':id')
  async getTour(@Param('id') tourId: string) {
    this.logger.log('tourId: ' + tourId);
    const vrTour = await this.tourService.getTour(tourId);
    return {
      item: vrTour,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('')
  async getAllTours() {
    return 'This action returns all tours';
  }
}
