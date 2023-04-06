import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
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
                containHotspot: {
                  include: {
                    nextScene: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return vrTour;
  }
}
