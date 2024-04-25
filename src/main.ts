import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CommonExceptionFilter } from './filters/common-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { configFirebaseAdmin } from './firebase.config';
import { PrismaService } from './prisma.service';

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
      // dismissDefaultMessages: true,
      exceptionFactory: (errors) => {
        const errorMessages = Object.values(errors[0]?.constraints)[0];
        return new BadRequestException(errorMessages);
      },
    }),
  );
  app.enableCors({
    origin: process.env.ALLOWED_CROSS_ORIGIN.split(', '),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.use(cookieParser());
  app.use(compression());
  configFirebaseAdmin(app.get(ConfigService));
}

bootstrap();
