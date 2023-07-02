import { Constant } from 'src/common/constant';
import { PrismaService } from './../prisma.service';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EmbeddedTour, Tour, PrivacyStatus } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TourService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redisService: RedisService,
  ) {}
  private readonly logger = new Logger(TourService.name);

  async getAllTours({ start, size, ...queryParams }) {
    this.logger.log(`getAllTours: ${start}, ${size}, ${queryParams.category}`);
    return await this.prismaService.$transaction([
      this.prismaService.tour.count({
        where: {
          category: queryParams.category,
          privacyStatus: PrivacyStatus.PUBLIC,
        },
      }),
      this.prismaService.tour.findMany({
        skip: start,
        take: size,
        select: {
          name: true,
          id: true,
          encodeUrl: true,
          privacyStatus: true,
          category: true,
          address: true,
          description: true,
          socialImage: true,
          creator: {
            select: {
              userId: true,
              fullname: true,
              avatarUrl: true,
              address: true,
            },
          },
          likeCount: true,
          viewCount: true,
          createdAt: true,
        },
        where: {
          category: queryParams.category,
          privacyStatus: PrivacyStatus.PUBLIC,
        },
      }),
    ]);
  }

  async findOne(tourId: string): Promise<Tour | undefined> {
    let tour: Tour = null;
    tour = await this.cacheManager.get(Constant.CACHE_KEY_TOUR + tourId);
    if (!tour) {
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

  async findByEncodeUrl(encodeUrl: string): Promise<Tour | undefined> {
    const url = encodeURI(encodeUrl);
    this.logger.log(`findByEncodeUrl: ${url}`);
    let tour: Tour;
    tour = await this.cacheManager.get(Constant.CACHE_KEY_ENCODEURL + url);
    if (!tour) {
      tour = await this.prismaService.tour.findUnique({
        where: {
          encodeUrl: url,
        },
      });
      tour = tour.privacyStatus === PrivacyStatus.PUBLIC ? tour : null;
      if (tour)
        await this.cacheManager.set(Constant.CACHE_KEY_ENCODEURL + url, tour);
    }
    return tour;
  }

  async findByCreator(userId: string): Promise<EmbeddedTour[]> {
    let tours: EmbeddedTour[];
    tours = await this.cacheManager.get(Constant.CACHE_KEY_CREATOR + userId);
    this.logger.log('toursByCreator: ', tours?.length);
    if (!tours) {
      tours = await this.prismaService.tour.findMany({
        where: {
          creator: {
            is: {
              userId,
            },
          },
          privacyStatus: PrivacyStatus.PUBLIC,
        },
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
          socialImage: true,
          category: true,
          createdAt: true,
          modifiedAt: true,
          encodeUrl: true,
          likeCount: true,
          viewCount: true,
          creator: true,
          privacyStatus: true,
          editStatus: true,
        },
      });
      await this.cacheManager.set(Constant.CACHE_KEY_CREATOR + userId, tours);
    }
    return tours;
  }

  async deleteTour(tourId: string, { userId }) {
    await this.checkUserPermission(userId, tourId);
    await this.prismaService.tour.delete({
      where: {
        id: tourId,
      },
    });
    await this.redisService.deleteCreatorToursCache(userId);
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

  isCachedInvalid(cacheKey) {
    // const tour = await this.cacheManager.get(cacheKey);
    // this.logger.log(`isCachedInvalid: ${cacheKey}, ${JSON.stringify(tour)}`);
    this.logger.log(this.cacheManager.store.getTtl);
    return false;
  }
}
