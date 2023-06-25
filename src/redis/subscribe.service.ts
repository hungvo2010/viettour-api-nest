import { Injectable, Logger } from '@nestjs/common';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Constant } from 'src/common/constant';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import WebSocket from 'ws';

@Injectable()
export class SubscribeService {
  private readonly logger = new Logger(SubscribeService.name);
  private readonly wsLink: GraphQLWsLink;
  private readonly httpLink: HttpLink;
  private readonly splitLink: ApolloLink;
  private readonly client: ApolloClient<any>;
  constructor() {
    this.wsLink = new GraphQLWsLink(
      createClient({
        webSocketImpl: WebSocket,
        url: process.env.WS_MAIN_WRITE_API,
      }),
    );
    this.httpLink = new HttpLink({
      uri: process.env.MAIN_WRITE_API,
    });
    this.splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      this.wsLink,
      this.httpLink,
    );
    this.client = new ApolloClient({
      ssrMode: true,
      link: this.wsLink, // Replace with the GraphQL endpoint URL of Server B
      cache: new InMemoryCache(),
    });
  }
  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    // this.logger.log('Called every 5 seconds');
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  subscribeCacheInvalidationEvent() {
    this.client.subscribe({
      query: Constant.INVALIDATION_CACHE_SUBSCRIPTION,
    });
  }
}
