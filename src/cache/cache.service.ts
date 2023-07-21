import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Constant } from 'src/common/constant';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  private readonly logger = new Logger(CacheService.name);

  async deleteCreatorToursCache(userId: string) {
    await this.cacheManager.del(Constant.CACHE_KEY_CREATOR + userId);
  }

  async deleteCache(key: string) {
    this.logger.log(`deleteCache: ${key}`);
    await this.cacheManager.del(key);
    this.logger.log(await this.cacheManager.get(key));
  }

  // async subscribeInvalidateCacheEvent() {
  //   const mainWriteEndPoint = this.configService.get('MAIN_WRITE_ENDPOINT');
  //   const subscriptionReq = gql`
  //     subscription {
  //       cacheInvalidation {
  //         true
  //       }
  //     }
  //   `;
  //   const client = new ApolloClient({
  //     uri: mainWriteEndPoint,
  //     cache: Cache,
  //   });
  //   client.subscribe().subscribe({});
  // }
}
