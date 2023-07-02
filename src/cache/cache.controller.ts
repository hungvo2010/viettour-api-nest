import { Controller, Delete, Logger, Param } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('/v1.0/cache/')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  private readonly logger = new Logger(CacheController.name);
  @Delete(':key')
  async deleteCache(@Param('key') cacheKey: string) {
    await this.cacheService.deleteCache(cacheKey);
    return {
      message: 'Deleted cache successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
