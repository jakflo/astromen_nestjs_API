import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import auxSetup from './mainAuxSetup';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    auxSetup(app);

    const config = new DocumentBuilder()
        .setTitle('Astromen API')
        .setDescription('API documentation for Astromen')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    await app.listen(8000);
}

bootstrap().catch((e) => {
    throw e;
});
