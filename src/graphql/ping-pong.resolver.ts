import { Resolver, Mutation, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';

const PONG_EVENT_NAME = 'pong';

@Resolver('Ping')
export class PingPongResolvers {
  constructor(@Inject('PUB_SUB') private pubSub: PubSubEngine) {}

  @Mutation('ping')
  async ping() {
    const pingId = Date.now();
    this.pubSub.publish(PONG_EVENT_NAME, { [PONG_EVENT_NAME]: { pingId } });
    return { id: pingId };
  }

  @Subscription(PONG_EVENT_NAME)
  pong() {
    console.log('pong');
    return this.pubSub.asyncIterator(PONG_EVENT_NAME);
  }
}
