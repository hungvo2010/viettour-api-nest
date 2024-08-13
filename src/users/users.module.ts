import { Module } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { NativeMongoService } from 'src/tour/controller/native.mongo.service';
import { TourService } from 'src/tour/tour.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TourService, CacheService, NativeMongoService],
  exports: [UsersService],
})
export class UsersModule {}
