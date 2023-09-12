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
import { Tour, PrivacyStatus, EditStatus } from '@prisma/client';
import { Constant } from 'src/common/constant';
import { PrismaService } from 'src/prisma.service';
import { NativeMongoService } from './controller/native.mongo.service';

@Injectable()
export class TourService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private nativeMongoService: NativeMongoService,
  ) {}
  private readonly logger = new Logger(TourService.name);

  async getAllTours({ size, category, createdAt }) {
    this.logger.log(`getAllTours: ${size}, ${category}, ${createdAt}`);
    return await this.prismaService.$transaction([
      this.prismaService.tour.count({
        where: {
          category,
          privacyStatus: PrivacyStatus.PUBLIC,
          editStatus: EditStatus.PUBLISHED,
        },
      }),
      this.prismaService.tour.findMany({
        take: size,
        ...(createdAt && {
          cursor: {
            createdAt,
          },
          skip: 1,
        }),
        select: GET_TOUR_RESPONSE,
        where: {
          category: category,
          privacyStatus: PrivacyStatus.PUBLIC,
          editStatus: EditStatus.PUBLISHED,
        },
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
    tour = await this.cacheManager.get(Constant.CACHE_KEY_TOUR + tourId);
    if (!tour) {
      this.logger.log('Tour not cached: ', tourId);
      tour = await this.prismaService.tour.findFirst({
        where: {
          id: tourId,
          OR: [
            {
              privacyStatus: PrivacyStatus.PUBLIC,
            },
            {
              privacyStatus: PrivacyStatus.UNLISTED,
            },
          ],
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
      await this.cacheManager.set(Constant.CACHE_KEY_TOUR + tourId, tour);
    }
    return tour;
  }

  async handleIncreaseViewCount(tour: Tour): Promise<number | undefined> {
    let viewCount = await this.cacheManager.get(
      Constant.CACHE_KEY_TOURVIEW + tour.id,
    );
    this.logger.log('viewCount: ', viewCount);
    viewCount = viewCount ? +viewCount + 1 : tour.viewCount + 1;
    await this.cacheManager.set(
      Constant.CACHE_KEY_TOURVIEW + tour.id,
      viewCount,
    );
    return viewCount;
  }

  async handleIncreaseLikeCount(
    tourId: string,
    liked: number,
  ): Promise<number | undefined> {
    let likeCount = await this.cacheManager.get(
      Constant.CACHE_KEY_TOURLIKE + tourId,
    );
    this.logger.log('likeCount: ', likeCount);
    likeCount = likeCount ? +likeCount + liked : 1;
    await this.cacheManager.set(
      Constant.CACHE_KEY_TOURLIKE + tourId,
      likeCount,
    );
    return likeCount;
  }

  async findByEncodeUrl(encodeUrl: string): Promise<Tour | undefined> {
    const url = encodeURI(encodeUrl);
    this.logger.log(`findByEncodeUrl: ${url}`);
    let tour: Tour;
    const tourId = await this.getTourIdByEncodeUrl(url);
    this.logger.log('tourId: ', tourId);
    if (tourId) {
      tour = await this.findOne(tourId);
    } else {
      tour = await this.prismaService.tour.findUnique({
        where: {
          encodeUrl: url,
        },
      });
      tour = tour.privacyStatus === PrivacyStatus.PUBLIC ? tour : null;
      if (tour) {
        await this.cacheManager.set(
          Constant.CACHE_KEY_ENCODEURL + url,
          tour.id,
        );
        // await this.cacheManager.set(Constant.CACHE_KEY_TOUR + tour.id, tour);
      }
    }
    if (tour) {
      tour.viewCount = await this.handleIncreaseViewCount(tour);
    }
    return tour;
  }

  async getTourIdByEncodeUrl(url: string) {
    const tourId = await this.cacheManager.get(
      Constant.CACHE_KEY_ENCODEURL + url,
    );
    return tourId;
  }

  async findByCreator(userId: string): Promise<any[]> {
    const tours = await this.prismaService.tour.findMany({
      where: {
        creator: {
          is: {
            userId,
          },
        },
      },
      select: GET_TOUR_BY_CREATOR_RESPONSE,
    });
    return tours;
  }

  async likeTour(tourId: string, { liked }) {
    await this.handleIncreaseLikeCount(tourId, liked);
  }

  async deleteTour(tourId: string, { userId }) {
    this.logger.log(`deleteTour: ${tourId} of user ${userId}`);
    await this.checkUserPermission(userId, tourId);
    await this.prismaService.tour.delete({
      where: {
        id: tourId,
      },
    });
  }

  async checkUserPermission(userId: string, tourId: string) {
    const tour = await this.prismaService.tour.findUnique({
      where: {
        id: tourId,
      },
    });
    if (!tour) throw new NotFoundException('Tour not found');
    if (tour?.creator?.userId !== userId)
      throw new ForbiddenException('Wrong permission');
  }

  async updateUserFailed() {
    const creator = await this.prismaService.user.findUnique({
      where: {
        id: '643eb17f10cf8fc98ca2db2b',
      },
    });
    this.logger.log('creator: ' + JSON.stringify(creator));
    const tours = await this.prismaService.tour.findMany({
      where: {
        creator: {
          is: {
            userId: undefined,
          },
        },
      },
    });
    this.logger.log('tours: ' + JSON.stringify(tours));
    tours.forEach(async (tour) => {
      await this.prismaService.tour.update({
        where: {
          id: tour.id,
        },
        data: {
          creator: {
            userId: creator.id,
            fullname: creator.fullname,
            avatarUrl: creator.avatarUrl,
            address: creator.address,
            description: creator.description,
            userCategory: creator.userCategory,
            phoneNumber: creator.phoneNumber,
          },
        },
      });
    });
  }

  async batchUpdateAddress() {
    // todo: write batch update using PrismaService to update tour.address to addressName and location properties in schema.prisma
    const tours = await this.prismaService.tour.findMany({
      where: {
        NOT: {
          OR: [
            {
              address: undefined,
            },
            {
              address: null,
            },
          ],
        },
      },
    });
    this.logger.log('tours: ' + JSON.stringify(tours));
    tours.forEach(async (tour) => {
      await this.prismaService.tour.update({
        where: {
          id: tour.id,
        },
        data: {
          addressName: tour.address.name,
          location: {
            type: 'Point',
            coordinates: [tour.address.lng, tour.address.lat],
          },
        },
      });
    });
  }
}
