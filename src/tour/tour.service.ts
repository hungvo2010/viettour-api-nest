import { Constant } from 'src/constant';
import { PrismaService } from './../prisma.service';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EmbeddedTour, Tour } from '@prisma/client';

@Injectable()
export class TourService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(TourService.name);

  async findOne(tourId: string): Promise<Tour | undefined> {
    let tour: Tour;
    tour = await this.cacheManager.get(Constant.CACHE_KEY_TOUR + tourId);
    if (!tour) {
      tour = await this.prismaService.tour.findUnique({
        where: {
          id: tourId,
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
          },
        },
      });
    }
    return tour;
  }

  async findByEncodeUrl(encodeUrl: string): Promise<Tour | undefined> {
    const url = encodeURI(encodeUrl);
    let tour: Tour;
    tour = await this.cacheManager.get(Constant.CACHE_KEY_ENCODEURL + url);
    if (!tour) {
      tour = await this.prismaService.tour.findUnique({
        where: {
          encodeUrl: url,
        },
      });
    }
    return tour;
  }

  async findByCreator(userId: string): Promise<EmbeddedTour[]> {
    let tours: EmbeddedTour[];
    tours = await this.cacheManager.get(Constant.CACHE_KEY_CREATOR + userId);
    if (!tours) {
      tours = await this.prismaService.tour.findMany({
        where: {
          creator: {
            is: {
              userId,
            },
          },
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
        },
      });
    }
    return tours;
  }
}
