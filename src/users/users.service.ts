import { TourService } from './../tour/tour.service';
import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User, EmbeddedTour } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

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
    await this.prismaService.user.update({
      where: {
        id: needUpdateUserId,
      },
      data: updateUserDto,
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

  async findByUserIdIncludeTours(userId: string): Promise<User | undefined> {
    const user = await this.findByUserId(userId);
    user.tours = await this.getUserTours(userId);
    return user;
  }

  async getUserTours(userId: string): Promise<EmbeddedTour[]> {
    const tours = await this.tourService.findByCreator(userId);
    return tours;
  }

  async checkUserPermission(initReqUserId: string, needUpdateUserId: string) {
    if (initReqUserId !== needUpdateUserId) {
      throw new ForbiddenException('Forbidden');
    }
  }
}
