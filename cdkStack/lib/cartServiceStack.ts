import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class CartServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartServiceLambda = new NodejsFunction(this, 'CartServiceLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: join(__dirname, '../../src/lambda.ts'),
      bundling: {
        externalModules: [
          'aws-sdk',
          '@nestjs/websockets',
          '@nestjs/microservices',
          'class-transformer',
          'class-validator',
        ],
        minify: true,
        sourceMap: true,
      },
      environment: {
        NODE_ENV: 'production',
        DB_HOST: process.env.DB_HOST ?? '',
        DB_PORT: process.env.DB_PORT ?? '',
        DB_USERNAME: process.env.DB_USERNAME ?? '',
        DB_PASSWORD: process.env.DB_PASSWORD ?? '',
        DB_NAME: process.env.DB_NAME ?? '',
      },
      timeout: cdk.Duration.seconds(30),
      // memorySize: 1024,
    });

    const fnUrl = cartServiceLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      // cors: {
      //   allowedOrigins: ['*'],
      //   allowedMethods: [lambda.HttpMethod.ALL],
      //   allowedHeaders: ['*'],
      // },
    });

    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: fnUrl.url,
      description: 'URL for the Lambda function',
    });
  }
}
