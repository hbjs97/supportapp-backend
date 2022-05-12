import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('SupportApp Documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' }, 'jwt');

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('/api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.info(`Documentation: http://localhost:${process.env.PORT}/api-docs`);
}
