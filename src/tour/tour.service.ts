import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { Tour } from '@prisma/client';

@Injectable()
export class TourService {
  constructor(private readonly prismaService: PrismaService) {}

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
    const vrTour = await this.prismaService.tour.findUnique({
      where: {
        encodeUrl,
      },
    });
    return vrTour;
  }
}
