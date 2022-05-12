import './expand-prototype';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from 'src/shared/config';
import { CommonModule, HttpExceptionsFilter, LoggerMiddleware } from './shared/common';
import { QueryFailedFilter } from './shared/common/filters/query-failed.filter';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get('db'),
      }),
      inject: [ConfigService],
    }),

    CommonModule, // Global
    V1Module,
  ],
  providers: [
    { provide: APP_FILTER, useClass: QueryFailedFilter },
    { provide: APP_FILTER, useClass: HttpExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
