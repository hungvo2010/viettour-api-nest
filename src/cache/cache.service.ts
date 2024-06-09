import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { Constant } from 'src/common/constant';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}
  private readonly logger = new Logger(CacheService.name);

  async deleteCreatorToursCache(userId: string) {
    await this.cacheManager.del(Constant.CACHE_KEY_CREATOR + userId);
  }

  async getItemFromCache(keyPrefix: string, key: string) {
    return await this.cacheManager.get(keyPrefix + key);
  }

  async addItemToCache(keyPrefix: string, key: string, value) {
    await this.cacheManager.set(keyPrefix + key, value);
  }

  async deleteCache(key: string) {
    this.logger.log(`deleteCache: ${key}`);
    await this.cacheManager.del(key);
    this.logger.log(await this.cacheManager.get(key));
  }

  @Cron(Constant.EVERY_2_MINUTES, { name: 'CronUpdateViewCount' })
  async handleCronUpdateView() {
    const keys = await this.cacheManager.store.keys();
    for (const key of keys) {
      if (key.startsWith(Constant.CACHE_KEY_TOURVIEW)) {
        const viewCount: number = await this.cacheManager.get(key);
        await this.prismaService.tour.update({
          where: {
            id: key.replace(Constant.CACHE_KEY_TOURVIEW, ''),
          },
          data: {
            statistic: {
              viewCount,
            },
          },
        });
        await this.cacheManager.set(key, 0);
      }
    }
  }

  @Cron(Constant.EVERY_2_MINUTES, { name: 'CronUpdateLikeCount' })
  async handleCronUpdateLike() {
    const keys = await this.cacheManager.store.keys();
    for (const key of keys) {
      if (key.startsWith(Constant.CACHE_KEY_TOURLIKE)) {
        const likeCount: number = await this.cacheManager.get(key);
        await this.prismaService.tour.update({
          where: {
            id: key.replace(Constant.CACHE_KEY_TOURLIKE, ''),
          },
          data: {
            statistic: {
              likeCount: likeCount,
            },
          },
        });
        await this.cacheManager.set(key, 0);
      }
    }
  }
}
