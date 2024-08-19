import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestContext } from 'src/common/data/context/RequestContext';
import { Response } from 'src/common/data/response/Response';
import { buildHateoasUrl } from 'src/common/utils';
import { ResponseUtils } from 'src/common/utils/ResponseUtils';
import { CustomLogger } from 'src/logger/custom-logger';
import { ArgumentType } from '../argument.type';
import { PaginationCriteria } from '../criteria/pagination.criteria';
import { FindAddressDto } from '../dto/request/find-address.dto';
import { GetTourDto } from '../dto/request/get-tour.dto';
import { LikeTourDto } from '../dto/request/like-tour.dto';
import { FilterArguments } from '../filter.arguments';
import { TourService } from '../tour.service';
import { JwtAuthGuard } from './../../guards/jwt-auth.guard';

@Controller('/v1.0/tours')
export class TourViewerController {
  constructor(
    private readonly tourService: TourService,
    private readonly context: RequestContext,
    private readonly logger: CustomLogger,
  ) {}

  @Get('')
  async getAllTours(
    @Request() req,
    @Query() queryDto: GetTourDto,
  ): Promise<Response<any>> {
    this.logger.logInfo(
      this.context,
      `getAllTours: ${JSON.stringify(queryDto)}`,
    );
    const filterArguments = this.buildFilterArguments(queryDto);
    const [total, tours] = await this.tourService.getAllToursNew(queryDto);
    return ResponseUtils.ok({
      total,
      length: tours.length,
      values: tours,
      next: buildHateoasUrl(req.path, {
        ...queryDto,
        cursor: tours[tours.length - 1]?.id,
      }),
    });
  }

  @Get('/search')
  async getTourByFilter(@Query('query') query: string) {
    this.logger.log(`getTourByFilter: ${query}`);
    const tours = await this.tourService.getToursWithFilter(query);
    return {
      values: tours,
    };
  }

  @Get('/address')
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
    };
  }

  @Get(':id')
  async getTour(@Param('id') tourId: string) {
    this.logger.log(`getTour: ${tourId}`);
    const vrTour = await this.tourService.findOne(tourId);
    return {
      item: vrTour,
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
    };
  }

}
