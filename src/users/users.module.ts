import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { TourService } from 'src/tour/tour.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, TourService, RedisService],
  exports: [UsersService],
})
export class UsersModule {}
