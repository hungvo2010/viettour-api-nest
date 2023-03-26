import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TourModule } from './tour/tour.module';

@Module({
  imports: [UsersModule, TourModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
