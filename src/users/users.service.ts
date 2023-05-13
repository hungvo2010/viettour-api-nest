import { TourService } from './../tour/tour.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
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

  findAll() {
    return `This action returns all users`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
    return '';
  }

  async upsert(user: any) {
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
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async findByUserIdIncludeTours(userId: string): Promise<User | undefined> {
    const user = await this.findByUserId(userId);
    user.tours = await this.tourService.findByCreator(userId);
    return user;
  }
}
