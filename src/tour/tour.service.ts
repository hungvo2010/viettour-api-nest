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
    this.logger.log('userId: ' + userId);
    // const tours = await this.prismaService.tour.findMany({
    //   where: {
    //     creator: {
    //       userId: '6421b8ba50edb74f1db02083',
    //       fullname: 'vo chanh hung',
    //       avatarUrl:
    //         'https://media.istockphoto.com/id/1296158947/photo/portrait-of-creative-trendy-black-african-male-designer-laughing.jpg?s=612x612&w=0&k=20&c=1Ws_LSzWjYvegGxHYQkkgVytdpDcnmK0upJyGOzEPcg=',
    //       address: null,
    //       description:
    //         "We don't know much about you, but we're sure you are great and the profile will be completed soon.",
    //       userCategory: 'VIRTUAL_TOUR_ENTHUSIAST',
    //       phoneNumber: null,
    //     },
    //   },
    // });
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
