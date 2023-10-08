import { JwtAuthGuard } from './../../guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TourService } from '../tour.service';
import { GetTourDto } from '../dto/get-tour.dto';
import { LikeTourDto } from '../dto/like-tour.dto';
import { FindAddressDto } from '../dto/find-address.dto';

@Controller('/v1.0/tours/')
export class TourViewerController {
  constructor(private readonly tourService: TourService) {}
  private readonly logger = new Logger(TourViewerController.name);

  @Get('all')
  async getAllTours(@Query() queryDto: GetTourDto) {
    this.logger.log(`getAllTours: ${JSON.stringify(queryDto)}`);
    const [total, tours] = await this.tourService.getAllTours(queryDto);
    return {
      total,
      values: tours,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('search')
  async getTourByFilter(@Query('query') query: string) {
    this.logger.log(`getTourByFilter: ${query}`);
    const tours = await this.tourService.getToursWithFilter(query);
    return {
      values: tours,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('address')
  async findToursByAddress(@Query() queryDto: FindAddressDto) {
    this.logger.log(
      `findToursByAddress: lat: ${queryDto.lat}, lng: ${queryDto.lng}`,
    );
    const tours = await this.tourService.findToursByAddress(
      +queryDto.lat,
      +queryDto.lng,
    );
    return {
      values: tours,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getTour(@Param('id') tourId: string) {
    this.logger.log(`getTour: ${tourId}`);
    const vrTour = await this.tourService.findOne(tourId);
    return {
      item: vrTour,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async getTourByEncodeUrl(@Query('encodeUrl') encodeUrl: string) {
    this.logger.log('Get tour by encodeUrl: ' + encodeUrl);
    const vrTour = await this.tourService.findByEncodeUrl(encodeUrl);
    return {
      item: vrTour,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/like')
  async likeTour(
    @Body() likeTourDto: LikeTourDto,
    @Param('id') tourId: string,
  ) {
    this.logger.log('Like tour: ' + tourId);
    await this.tourService.likeTour(tourId, likeTourDto.liked);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async deleteTour(@Param('id') tourId: string, @Req() req) {
    this.logger.log('Delete tour: ' + tourId);
    await this.tourService.deleteTour(tourId, req.user.id);
    return {
      message: 'Deleted tour successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
