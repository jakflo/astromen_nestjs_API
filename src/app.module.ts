import { Module } from '@nestjs/common';
import AppController from './app.controller';
import GetAstromenModule from './getAstromen/getAstromen.module';
import AddAstromanModule from './addAstroman/addAstroman.module';
import EditAstromanModule from './editAstroman/editAstroman.module';
import DeleteAstromanModule from './deleteAstroman/deleteAstroman.module';
import SkillsModule from './skills/skills.module';

@Module({
    imports: [
        GetAstromenModule,
        AddAstromanModule,
        EditAstromanModule,
        SkillsModule,
        DeleteAstromanModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
