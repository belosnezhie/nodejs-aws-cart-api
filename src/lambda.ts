import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { Cart as CartEntity } from './db/cart.entity';
import { CartItem as CartItemEntity } from './db/cart.item.entity';

let cachedServer: Handler;
let dataSource: DataSource;

export const handler = async (event: any, context: Context, callback: any) => {
  try {
    console.log('Start to transform event');
    const transformedEvent = getTransformedEvent(event);
    console.log('Start to initialize database and server');
    const [, server] = await Promise.all([
      initializeDatabase(),
      initializeServer(),
    ]);
    console.log('Start to get server response');
    return getServerResponse(server, transformedEvent, context, callback);
  } catch (error) {
    console.error('Lambda error: ', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
    };
  }
};

function getTransformedEvent(event: any) {
  const transformedEvent = {
    ...event,
    path: event.rawPath || '/',
    httpMethod: event.requestContext.http.method,
    // Ensure other required properties exist
    queryStringParameters: event.queryStringParameters || {},
    pathParameters: event.pathParameters || {},
    headers: {
      ...event.headers,
      'Content-Type':
        event.headers?.['Content-Type'] ||
        event.headers?.['content-type'] ||
        'application/json',
    },
  };
  return transformedEvent;
}

async function initializeDatabase(): Promise<boolean> {
  if (!dataSource || !dataSource.isInitialized) {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [CartEntity, CartItemEntity],
      // synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await dataSource.initialize();
  }

  return true;
}

async function initializeServer(): Promise<any> {
  return await bootstrap();
}

async function getServerResponse(
  server: any,
  transformedEvent: any,
  context: Context,
  callback: any,
) {
  const response = await server(transformedEvent, context, callback);

  return {
    ...response,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      ...(response.headers || {}),
    },
  };
}

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();

    expressApp.use(
      express.json({
        verify: (req: any, res, buf) => {
          req.rawBody = buf.toString();
        },
      }),
    );

    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        logger: new ConsoleLogger(),
      },
    );

    nestApp.enableCors();

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}
