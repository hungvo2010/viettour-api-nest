import { PrismaService } from './../prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Tour } from '@prisma/client';

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
}
