import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import {
  GET_TOUR_BY_CREATOR_RESPONSE,
  GET_TOUR_RESPONSE,
} from './res/get-tour-response';
import { FIND_ONE_CONFIG_CONDITION } from './tour.constant';
import { GetTourDto } from './dto/get-tour.dto';
import { Tour, PrivacyStatus, EditStatus, TourCategory } from '@prisma/client';
import { Constant } from 'src/common/constant';
import { PrismaService } from 'src/prisma.service';
import { NativeMongoService } from './controller/native.mongo.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class TourService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private nativeMongoService: NativeMongoService,
    private readonly cacheService: CacheService,
  ) {}
  private readonly logger = new Logger(TourService.name);

  async getAllTours(queryParams: GetTourDto) {
    this.logger.log(`getAllTours: ${JSON.stringify(queryParams)}`);
    return await this.prismaService.$transaction([
      this.prismaService.tour.count({
        where: this.publicToursByCategoryCondition(queryParams.category),
      }),
      this.prismaService.tour.findMany({
        ...this.buildCursorParams(queryParams.size, queryParams.cursor),
        select: GET_TOUR_RESPONSE,
        where: this.publicToursByCategoryCondition(queryParams.category),
      }),
    ]);
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
          id: tourId,
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

  async findByEncodeUrl(encodeUrl: string): Promise<Tour | undefined> {
    const url = encodeURI(encodeUrl);
    this.logger.log(`findByEncodeUrl: ${url}`);
    let tour: Tour;
    tour = (await this.cacheService.getItemFromCache(
      Constant.CACHE_KEY_ENCODEURL,
      url,
    )) as Tour;
    if (!tour) {
      tour = await this.prismaService.tour.findUnique({
        where: {
          encodeUrl: url,
        },
      });
      tour = tour.config.privacyStatus === PrivacyStatus.PUBLIC ? tour : null;
      if (tour) {
        await this.cacheService.addItemToCache(
          Constant.CACHE_KEY_ENCODEURL,
          url,
          tour,
        );
      }
    }
    if (tour) {
      tour.statistic.viewCount = await this.handleIncreaseViewCount(tour);
    }
    return tour;
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

  buildCursorParams(size: number, cursor: string) {
    return {
      take: size,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    };
  }

  publicToursByCategoryCondition(category: TourCategory) {
    return {
      category,
      config: {
        is: {
          privacyStatus: PrivacyStatus.PUBLIC,
          editStatus: EditStatus.PUBLISHED,
        },
      },
    };
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
}
