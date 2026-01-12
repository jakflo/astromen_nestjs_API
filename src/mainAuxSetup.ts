import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { INestApplication } from '@nestjs/common';

function auxSetup(app: INestApplication) {
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
}

export default auxSetup;
