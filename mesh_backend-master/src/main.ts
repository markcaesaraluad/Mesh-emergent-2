import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration - update origin for production
  app.enableCors({
    allowedHeaders: 'Content-Type, Authorization',
    origin: [
    'https://meshsystem.meshconnectcoworking.space', 
    'https://www.meshsystem.meshconnectcoworking.space',
    'http://localhost:8080',
    'http://192.168.1.4:8080/'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('MeshConnect')
      .setDescription('The description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
  }

  // Use environment variable for port
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}
bootstrap();