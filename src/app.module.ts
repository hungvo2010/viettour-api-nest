import { Constant } from 'src/constant';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TourModule } from './tour/tour.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
// import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    UsersModule,
    TourModule,
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    AuthModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as unknown as CacheStore,
        socket: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
        username: configService.get('REDIS_USERNAME'),
        password: configService.get('REDIS_PASSWORD'),
        ttl: Constant.REDIS_TTL,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
