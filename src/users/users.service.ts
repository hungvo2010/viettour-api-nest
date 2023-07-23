import { TourService } from './../tour/tour.service';
import {
  Injectable,
  Logger,
  ForbiddenException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User, EmbeddedTour, PrivacyStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Constant } from 'src/common/constant';
import { length } from 'class-validator';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
    private tourService: TourService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
    };
    return this.prismaService.user.create({
      data,
    });
  }

  async getProfile(user: any) {
    this.logger.log('user: ' + JSON.stringify(user));

    return this.findByUserId(user.userId);
  }

  async update(
    needUpdateUserId: string,
    initReqUserId: string,
    { email, password, ...updateUserDto }: UpdateUserDto,
  ) {
    this.logger.log(
      'needUpdateUserId: ' + needUpdateUserId,
      'initReqUserId: ' + initReqUserId,
    );
    await this.checkUserPermission(initReqUserId, needUpdateUserId);
    // return await this.prismaService.$transaction(async () => {
    await this.prismaService.user.update({
      where: {
        id: needUpdateUserId,
      },
      data: updateUserDto,
    });
    const tours = await this.prismaService.tour.findMany({
      where: {
        creator: {
          is: {
            userId: needUpdateUserId,
          },
        },
      },
    });
    this.logger.log(tours);
    tours.forEach(async (tour) => {
      this.logger.log('tour: ' + tour.id);
      await this.cacheManager.del(Constant.CACHE_KEY_TOUR + tour.id);
      await this.cacheManager.del(
        Constant.CACHE_KEY_ENCODEURL + tour.encodeUrl,
      );
      await this.prismaService.tour.update({
        where: {
          id: tour.id,
        },
        data: {
          creator: {
            ...tour.creator,
            fullname: updateUserDto.fullname,
          },
          encodeUrl: this.buildTourEncodeUrl(
            tour.name,
            updateUserDto.fullname,
            tour.id,
          ),
        },
      });
    });
    // });
  }

  async updateOrCreate(user: any) {
    const data: Prisma.UserCreateInput = {
      ...user,
    };
    return await this.prismaService.user.upsert({
      where: {
        email: user.email,
      },
      update: data,
      create: {
        ...data,
        password: '',
      },
    });
  }

  delete(id: string) {
    const where: Prisma.UserWhereUniqueInput = {
      id,
    };
    return this.prismaService.user.delete({
      where,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUserId(userId: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  // async findByUserIdIncludeTours(userId: string): Promise<User | undefined> {
  //   const user = await this.findByUserId(userId);
  //   let allUserTours = await this.getUserTours(userId);
  //   allUserTours = allUserTours.filter((tour) => {
  //     if (
  //       tour.privacyStatus === PrivacyStatus.PUBLIC ||
  //       tour.creator.id === userId
  //     ) {
  //       return true;
  //     }
  //   });
  //   user.tours = allUserTours;
  //   return user;
  // }

  async getUserTours(userId: string, initReqUserId: string): Promise<any[]> {
    this.logger.log('initGetUserTours: ' + initReqUserId);
    let tours = await this.tourService.findByCreator(userId);
    tours = tours.filter((tour) => {
      if (
        tour.privacyStatus === PrivacyStatus.PUBLIC ||
        tour.creator.userId === initReqUserId
      ) {
        return true;
      }
      return false;
    });
    return tours;
  }

  async checkUserPermission(initReqUserId: string, needUpdateUserId: string) {
    if (initReqUserId !== needUpdateUserId) {
      this.logger.log('checkUserPermission: ' + initReqUserId);
      throw new ForbiddenException('Forbidden');
    }
  }

  buildTourEncodeUrl(tourName: string, creatorName: string, tourId: string) {
    const encodeUrl = `p/${encodeURIComponent(
      creatorName.replace(/ /g, '-'),
    )}/t/${encodeURIComponent(tourName.replace(/ /g, '-'))}-${tourId.slice(
      0,
      12,
    )}`;
    return encodeUrl;
  }
}
