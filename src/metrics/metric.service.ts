import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly requestCounter: Counter;
  constructor() {
    this.requestCounter = new Counter({
      name: 'nestjs_requests_total',
      help: 'Total number of requests to the NestJS app',
      registers: [register],
    });
    register.clear();
    register.setDefaultLabels({
      app: 'nestjs-prometheus-demo',
    });
    register.registerMetric(this.requestCounter);
  }

  incrementRequestCounter(): void {
    this.requestCounter.inc();
  }
}
