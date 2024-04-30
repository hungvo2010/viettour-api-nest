import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { EditStatus, Prisma, PrivacyStatus } from '@prisma/client';
import { excludeField } from 'src/common/utils';
import { PrismaService } from 'src/prisma.service';
import { TourService } from './../tour/tour.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
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

  async getProfile(userId: any) {
    return this.findByUserId(userId);
  }

  async updateUser(userId: string, updateData: UpdateUserDto) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });
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

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUserId(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    return excludeField(user, ['password']);
  }

  async getUserTours(userId: string, initReqUserId: string): Promise<any[]> {
    this.logger.log('get UserTours init userID: ' + initReqUserId);
    let tours = await this.tourService.findByCreator(userId);
    if (initReqUserId !== userId) {
      tours = tours.filter((tour) => {
        if (
          tour.privacyStatus === PrivacyStatus.PUBLIC &&
          tour.editStatus === EditStatus.PUBLISHED
        ) {
          return true;
        }
        return false;
      });
    }
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

  exclude(user, keys) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key)),
    );
  }
}
