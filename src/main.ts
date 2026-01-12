import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import auxSetup from './mainAuxSetup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    auxSetup(app);
    await app.listen(8000);
}

bootstrap();
