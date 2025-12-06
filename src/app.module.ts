import { Module } from '@nestjs/common';
import AppController from './app.controller';
import GetAstromenModule from './getAstromen/getAstromen.module';
import AddAstromanModule from './addAstroman/addAstroman.module';
import SkillsModule from './skills/skills.module';

@Module({
  imports: [GetAstromenModule, AddAstromanModule, SkillsModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
