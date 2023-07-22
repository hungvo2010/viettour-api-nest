import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { TourService } from 'src/tour/tour.service';
import { CacheService } from 'src/cache/cache.service';
import { NativeMongoService } from 'src/tour/controller/native.mongo.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    TourService,
    CacheService,
    NativeMongoService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
