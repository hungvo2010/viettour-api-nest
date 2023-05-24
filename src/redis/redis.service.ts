import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma.service';
import { Constant } from 'src/constant';

@Injectable()
export class RedisService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(RedisService.name);

  async deleteCreatorToursCache(userId: string) {
    await this.cacheManager.del(Constant.CACHE_KEY_CREATOR + userId);
  }
}
