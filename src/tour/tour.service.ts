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
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class TourService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cacheService: CacheService,
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
      this.logger.log('tour not cached: ', tourId);
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
    const tourId = await this.getTourIdByEncodeUrl(url);
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
      }
    }
    return tour;
  }

  async getTourIdByEncodeUrl(url: string) {
    const tourId = await this.cacheManager.get(
      Constant.CACHE_KEY_ENCODEURL + url,
    );
    return tourId;
  }

  async findByCreator(userId: string): Promise<EmbeddedTour[]> {
    // let tours: EmbeddedTour[];
    // tours = await this.cacheManager.get(Constant.CACHE_KEY_CREATOR + userId);
    // this.logger.log('toursByCreator: ', userId);
    // if (!tours) {
    const tours = await this.prismaService.tour.findMany({
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
    // await this.cacheManager.set(Constant.CACHE_KEY_CREATOR + userId, tours);
    // }
    return tours;
  }

  async deleteTour(tourId: string, { userId }) {
    this.logger.log(`deleteTour: ${tourId} of user ${userId}`);
    await this.checkUserPermission(userId, tourId);
    await this.prismaService.tour.delete({
      where: {
        id: tourId,
      },
    });
    await this.cacheService.deleteCreatorToursCache(userId);
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
}
