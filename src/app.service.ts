import { Injectable, Logger } from '@nestjs/common';
import { HelloService } from './hello/HelloService';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private helloService: HelloService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getRoot(): string {
    this.helloService.sayHello('My name is getRoot');

    return 'Hello world!';
  }
}
