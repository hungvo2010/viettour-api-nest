import { JwtAuthGuard } from './../../guards/jwt-auth.guard';
import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TourService } from '../tour.service';
import { GetTourDto } from '../dto/get-tour.dto';

@Controller('/v1.0/tours/')
export class TourViewerController {
  constructor(private readonly tourService: TourService) {}
  private readonly logger = new Logger(TourViewerController.name);

  @Get('all')
  async getAllTours(@Query() queryDto: GetTourDto) {
    const tours = await this.tourService.getAllTours(queryDto);
    return {
      values: tours,
      timestamp: new Date().toISOString(),
    };
  }

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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTour(@Param('id') tourId: string, @Req() req) {
    this.logger.log(tourId);
    await this.tourService.deleteTour(tourId, req.user);
    return {
      message: 'Deleted tour successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
