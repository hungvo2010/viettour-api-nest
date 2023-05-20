import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    this.logger.log(process.env.JWT_SECRET);
    return 'Hello World!';
  }
}
