import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CommonExceptionFilter } from './filter/common-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });
  configureApp(app);
  await app.listen(parseInt(process.env.PORT) || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

function configureApp(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter(), new CommonExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.ALLLOWED_CROSS_ORIGIN.split(', '),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.use(cookieParser());
}

bootstrap();
