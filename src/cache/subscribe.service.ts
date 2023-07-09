// import { Injectable, Logger } from '@nestjs/common';
// import {
//   ApolloClient,
//   ApolloLink,
//   HttpLink,
//   InMemoryCache,
//   split,
// } from '@apollo/client/core';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { Constant } from 'src/common/constant';
// import { createClient } from 'graphql-ws';
// import { getMainDefinition } from '@apollo/client/utilities';
// import WebSocket from 'ws';
// import fetch from 'cross-fetch';

// @Injectable()
// export class SubscribeService {
//   private readonly logger = new Logger(SubscribeService.name);
//   private readonly wsLink: GraphQLWsLink;
//   private readonly httpLink: HttpLink;
//   private readonly splitLink: ApolloLink;
//   private client: ApolloClient<any>;
//   constructor() {
//     this.wsLink =
//       typeof window !== 'undefined'
//         ? new GraphQLWsLink(
//             createClient({
//               webSocketImpl: WebSocket,
//               url: process.env.WS_MAIN_WRITE_API,
//             }),
//           )
//         : null;
//     this.httpLink = new HttpLink({
//       uri: process.env.MAIN_WRITE_API,
//       fetch,
//       credentials: 'include',
//     });
//     this.splitLink =
//       typeof window !== 'undefined' && this.wsLink
//         ? split(
//             ({ query }) => {
//               const definition = getMainDefinition(query);
//               return (
//                 definition.kind === 'OperationDefinition' &&
//                 definition.operation === 'subscription'
//               );
//             },
//             this.wsLink,
//             this.httpLink,
//           )
//         : this.httpLink;
//   }
//   @Cron(CronExpression.EVERY_5_SECONDS)
//   handleCron() {
//     // this.logger.log('Called every 5 seconds');
//   }

//   @Cron(CronExpression.EVERY_5_SECONDS)
//   subscribeCacheInvalidationEvent() {
//     if (!this.client) {
//       this.client = new ApolloClient({
//         // ssrMode: true,
//         link: this.splitLink,
//         cache: new InMemoryCache(),
//       });
//     }
//     this.client
//       .subscribe({
//         query: Constant.INVALIDATION_CACHE_SUBSCRIPTION,
//       })
//       .subscribe({
//         next: (data) => {
//           this.logger.log(data);
//         },
//       });

//     // this.client
//     //   .mutate({
//     //     mutation: Constant.PING_MUTATION,
//     //   })
//     //   .then((res) => {
//     //     this.logger.log(res);
//     //   });
//   }
// }
