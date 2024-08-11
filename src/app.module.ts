import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-store';
import { Constant } from 'src/common/constant';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CacheInvalidateModule } from './cache/cache.invalidate.module';
import { RequestContext } from './common/data/context/RequestContext';
import { HelloService } from './hello/HelloService';
import { TimestampInterceptor } from './interceptors/timestamp.interceptor';
import { LoggerModule } from './logger/logger.module';
import { MetricsService } from './metrics/metric.service';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';
import { TourModule } from './tour/tour.module';
import { UsersModule } from './users/users.module';

@Global()
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
    LoggerModule,
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
  exports: [MetricsService, RequestContext],
  providers: [
    MetricsService,
    HelloService,
    RequestContext,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimestampInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
