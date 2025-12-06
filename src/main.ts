import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: false,
            },
        }),
    );
    
    useContainer(app.select(AppModule), { fallbackOnErrors: true }); //nutne, aby uvnitr custom validatoru fungovalo DI
    await app.listen(8000);
}

bootstrap();
