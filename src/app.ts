import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'src/shared/common';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap(): Promise<string> {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useLogger(await app.resolve(Logger));
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      disableErrorMessages: false,
      transform: true,
    }),
  );

  setupSwagger(app);
  middleware(app);

  await app.listen(process.env.PORT || 5000);
  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
