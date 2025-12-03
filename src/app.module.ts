import { Module } from '@nestjs/common';
import AppController from './app.controller';
import GetAstromenModule from './getAstromen/getAstromen.module';

@Module({
  imports: [GetAstromenModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
