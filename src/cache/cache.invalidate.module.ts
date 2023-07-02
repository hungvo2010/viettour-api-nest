import { ConfigService } from '@nestjs/config';
import { CacheController } from './cache.controller';
import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  controllers: [CacheController],
  providers: [CacheService, ConfigService],
})
export class CacheInvalidateModule {}
