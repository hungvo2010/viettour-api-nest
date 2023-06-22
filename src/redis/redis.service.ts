import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma.service';
import { Constant } from 'src/common/constant';
import { ApolloClient, gql } from '@apollo/client';

@Injectable()
export class RedisService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(RedisService.name);

  async deleteCreatorToursCache(userId: string) {
    await this.cacheManager.del(Constant.CACHE_KEY_CREATOR + userId);
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
