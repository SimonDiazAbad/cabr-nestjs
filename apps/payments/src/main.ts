import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.getOrThrow('RABBITMQ_URI')],
        noAck: false,
        queue: 'payments',
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await app.startAllMicroservices();
}
bootstrap();
