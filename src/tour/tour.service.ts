import { PrismaService } from './../prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { EmbeddedTour, Tour } from '@prisma/client';

@Injectable()
export class TourService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(TourService.name);

  async findOne(tourId: string): Promise<Tour | undefined> {
    const vrTour = await this.prismaService.tour.findUnique({
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
    return vrTour;
  }

  async findByEncodeUrl(encodeUrl: string): Promise<Tour | undefined> {
    const url = encodeURI(encodeUrl);
    const vrTour = await this.prismaService.tour.findUnique({
      where: {
        encodeUrl: url,
      },
    });
    return vrTour;
  }

  async findByCreator(userId: string): Promise<EmbeddedTour[]> {
    return await this.prismaService.tour.findMany({
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
}
