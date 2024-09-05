import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Tour } from '@prisma/client';
import { CacheService } from 'src/cache/cache.service';
import { Constant } from 'src/common/constant';
import { PrismaService } from 'src/prisma.service';
import { ArgumentType } from './argument.type';
import { NativeMongoService } from './controller/native.mongo.service';
import { FilterCriteria } from './criteria/filter.criteria';
import { PaginationCriteria } from './criteria/pagination.criteria';
import { SortingCriteria } from './criteria/sorting.criteria';
import { GetTourDto } from './dto/request/get-tour.dto';
import { FilterToursResponse } from './dto/response/filter.tours.response';
import { FilterArguments } from './filter.arguments';
import { TourPagination } from './interface/tour.pagination';
import { GET_TOUR_BY_CREATOR_RESPONSE } from './res/get-tour-response';
import { FIND_ONE_CONFIG_CONDITION } from './tour.constant';

@Injectable()
export class TourService {
  constructor(
    private readonly prismaService: PrismaService,
    private nativeMongoService: NativeMongoService,
    private readonly cacheService: CacheService,
  ) {}
  private readonly logger = new Logger(TourService.name);

  // async getAllTours(queryParams: GetTourDto) {
  //   this.logger.log(`getAllTours: ${JSON.stringify(queryParams)}`);
  //   return await this.prismaService.$transaction([
  //     this.prismaService.tour.count({
  //       where: this.filterTours(queryParams.category),
  //     }),
  //     this.prismaService.tour.findMany({
  //       ...this.buildCursorParams(queryParams.offset, queryParams.cursor),
  //       select: GET_TOUR_RESPONSE,
  //       where: this.filterTours(queryParams.category),
  //     }),
  //   ]);
  // }

  async getAllToursNew(
    queryDto: GetTourDto,
  ): Promise<FilterToursResponse<Tour>> {
    let filterArguments = this.buildFilterArguments(queryDto);
    let tours = await this.prismaService.tour.findMany({
      ...this.buildCursorParams(
        filterArguments.ofType(ArgumentType.PAGINATION) as PaginationCriteria,
      ),
      orderBy: this.buildSortingParams(
        filterArguments.ofType(ArgumentType.SORTING) as SortingCriteria,
      ),
      where: this.filterToursNew(
        filterArguments.ofType(ArgumentType.FILTER) as FilterCriteria,
      ),
    });
    return new FilterToursResponse(tours.length, tours, '');
  }

  buildSortingParams(sorting: SortingCriteria) {
    var result = {};
    sorting.getConfig().forEach((val) => {
      result[val.field] = val.order;
    });
    return result;
  }

  async getToursWithFilter(query: string) {
    return await this.nativeMongoService.performFullTextSearch(query);
  }

  async findToursByAddress(lat: number, lng: number) {
    return await this.nativeMongoService.performGeoSpatialSearch(lat, lng);
  }

  async findOne(tourId: string): Promise<Tour | undefined> {
    let tour: Tour = null;
    tour = await this.getTourFromCache(tourId);
    if (!tour) {
      this.logger.log('Tour cache missed: ', tourId);
      tour = await this.prismaService.tour.findFirst({
        where: {
          tourId,
          ...FIND_ONE_CONFIG_CONDITION,
        },
        include: {
          scenes: {
            include: {
              scene: {
                include: {
                  containHotspots: true,
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      this.cacheService.addItemToCache(Constant.CACHE_KEY_TOUR, tourId, tour);
    }
    return tour;
  }

  async handleIncreaseViewCount(tour: Tour): Promise<number | undefined> {
    let viewCount = +(await this.cacheService.getItemFromCache(
      Constant.CACHE_KEY_TOURVIEW,
      tour.id,
    ));
    viewCount = viewCount ? +viewCount + 1 : tour.statistic.viewCount + 1;
    await this.cacheService.addItemToCache(
      Constant.CACHE_KEY_TOURVIEW,
      tour.id,
      viewCount,
    );
    return viewCount;
  }

  async handleIncreaseLikeCount(
    tourId: string,
    liked: number,
  ): Promise<number | undefined> {
    let likeCount = +(await this.cacheService.getItemFromCache(
      Constant.CACHE_KEY_TOURLIKE,
      tourId,
    ));
    this.logger.log('likeCount: ', likeCount);
    likeCount = likeCount ? +likeCount + liked : 1;
    await this.cacheService.addItemToCache(
      Constant.CACHE_KEY_TOURLIKE,
      tourId,
      likeCount,
    );
    return likeCount;
  }

  async deleteTour(tourId: string, userId: string) {
    this.logger.log(`deleteTour: ${tourId} of user ${userId}`);
    await this.checkUserPermission(userId, tourId);
    await this.prismaService.tour.delete({
      where: {
        id: tourId,
      },
    });
  }

  async findByCreator(userId: string): Promise<any[]> {
    const tours = await this.prismaService.tour.findMany({
      where: {
        creatorId: userId,
      },
      select: GET_TOUR_BY_CREATOR_RESPONSE,
    });
    return tours;
  }

  async likeTour(tourId: string, liked) {
    await this.handleIncreaseLikeCount(tourId, liked);
  }

  async checkUserPermission(userId: string, tourId: string) {
    const tour = await this.findTourById(tourId);
    if (!tour) throw new NotFoundException('Tour not found');
    if (tour?.creatorId !== userId)
      throw new ForbiddenException('Wrong permission');
  }

  async findTourById(tourId: string) {
    return await this.prismaService.tour.findUnique({
      where: {
        id: tourId,
      },
    });
  }

  buildCursorParams(pagination: PaginationCriteria): TourPagination {
    if (pagination.cursor) {
      return {
        take: pagination.limit,
        ...(pagination.cursor && {
          cursor: { id: pagination.cursor },
          skip: 1,
        }),
      };
    }
    return {
      take: pagination.limit,
      skip: pagination.offset,
    };
  }

  filterToursNew(filterCriteria: FilterCriteria) {
    var filters = filterCriteria.getFilters();
    var result = {};
    Object.keys(filters).forEach((key) => {
      result[key] = filters[key];
    });
    return result;
  }

  async getTourFromCache(tourId: string): Promise<Tour | undefined> {
    return (await this.cacheService.getItemFromCache(
      Constant.CACHE_KEY_TOUR,
      tourId,
    )) as Tour;
  }

  async getTourIdByEncodeUrl(url: string): Promise<string> {
    return (await this.cacheService.getItemFromCache(
      Constant.CACHE_KEY_ENCODEURL,
      url,
    )) as string;
  }
  buildFilterArguments(queryDto: GetTourDto): FilterArguments {
    var allFilters = Object.assign({}, queryDto);
    var results: FilterArguments = new FilterArguments();
    results.add(ArgumentType.SORTING, new SortingCriteria(queryDto.sort));
    results.add(
      ArgumentType.PAGINATION,
      new PaginationCriteria(queryDto.pagination),
    );
    results.add(ArgumentType.FILTER, new FilterCriteria(allFilters));
    return results;
  }
}
