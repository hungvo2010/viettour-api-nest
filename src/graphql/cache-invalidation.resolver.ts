// import { Constant } from 'src/common/constant';
// import { Resolver, Mutation, Subscription } from '@nestjs/graphql';
// import { Inject } from '@nestjs/common';
// import { PubSubEngine } from 'graphql-subscriptions';

// @Resolver('CacheInvalidation')
// export class CacheInvalidationResolvers {
//   constructor(@Inject('PUB_SUB') private pubSub: PubSubEngine) {}

//   @Subscription(Constant.TOUR_CACHE_INVALIDATION_EVENT)
//   cacheInvalidation() {
//     console.log('cacheInvalidation');
//   }
// }
