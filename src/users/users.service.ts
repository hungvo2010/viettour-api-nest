import { TourService } from './../tour/tour.service';
import {
  Injectable,
  Logger,
  Inject,
  CACHE_MANAGER,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Cache } from 'cache-manager';
import { Constant } from 'src/constant';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prismaService: PrismaService,
    private tourService: TourService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  delete(id) {
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
    let user: User;
    user = await this.cacheManager.get(Constant.CACHE_KEY_USERID + userId);
    if (!user) {
      user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });
      await this.cacheManager.set(Constant.CACHE_KEY_USERID + userId, user);
    }
    return user;
  }

  async findByUserIdIncludeTours(userId: string): Promise<User | undefined> {
    const user = await this.findByUserId(userId);
    user.tours = await this.tourService.findByCreator(userId);
    return user;
  }

  async checkUserPermission(initReqUserId: string, needUpdateUserId: string) {
    if (initReqUserId !== needUpdateUserId) {
      throw new ForbiddenException('Forbidden');
    }
  }
}
