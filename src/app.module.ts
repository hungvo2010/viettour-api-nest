import { PrismaService } from './prisma.service';
import { Constant } from 'src/common/constant';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TourModule } from './tour/tour.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
// import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheInvalidateModule } from './cache/cache.invalidate.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimestampInterceptor } from './interceptors/timestamp.interceptor';

@Module({
  imports: [
    UsersModule,
    TourModule,
    CacheInvalidateModule,
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
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
    // GraphQLModule.forRoot({
    //   playground: true,
    //   typePaths: ['./**/*.graphql'],
    //   driver: ApolloDriver,
    //   installSubscriptionHandlers: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // SubscribeService,
    // PingPongResolvers,
    // CacheInvalidationResolvers,
    // {
    //   provide: 'PUB_SUB',
    //   useValue: new PubSub(),
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimestampInterceptor,
    },
  ],
})
export class AppModule {}
