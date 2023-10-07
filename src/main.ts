import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { json } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = process.env.APP_PORT;

  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: false,
  });

  app.useGlobalPipes(new ValidationPipe());

  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_PIX_OUT_CLIENT_ID,
          brokers: process.env.KAFKA_BROKER.split(','),
        },
        consumer: {
          groupId: process.env.KAFKA_ORDERS_GROUP_ID,
        },
      },
    },
  );
  await kafkaApp.listen();

  app.use(json({ limit: '1mb' }));
  app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      `frame-src 'none'; object-src 'none'; script-src 'self'; style-src 'self';`,
    );
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Permissions-Policy', '');
    next();
  });

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Gas Station - API')
    .setDescription('Gas Station - API')
    .setExternalDoc('Download JSON', '/docs-json')
    .addBearerAuth(
      {
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'app',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('/docs', app, document);

  process.on('uncaughtException', function () {});

  await app.listen(port, '0.0.0.0', () => {});
}

bootstrap().catch((err) => console.error(err));
