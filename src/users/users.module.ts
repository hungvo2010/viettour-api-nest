import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { TourService } from 'src/tour/tour.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, TourService],
  exports: [UsersService],
})
export class UsersModule {}
