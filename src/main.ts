import { TourService } from 'src/tour/tour.service';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { CommonExceptionFilter } from './filters/common-exception.filter';
import { configFirebaseAdmin } from './firebase.config';

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

  // const tourService = app.get(TourService);
  // await tourService.batchUpdateAddress();
}

function configureApp(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter(), new CommonExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
      dismissDefaultMessages: true,
      // exceptionFactory: (errors) => {
      //   const errorMessages = {};
      //   console.log(errors);
      //   errors.forEach((error) => {
      //     errorMessages[error.property] = Object.values(error.constraints)
      //       .join('. ')
      //       .trim();
      //   });
      //   // console.log(errorMessages);
      //   return new BadRequestException(errorMessages);
      // },
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
