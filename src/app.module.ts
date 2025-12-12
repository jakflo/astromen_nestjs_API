import { Module } from '@nestjs/common';
import AppController from './app.controller';
import GetAstromenModule from './getAstromen/getAstromen.module';
import AddAstromanModule from './addAstroman/addAstroman.module';
import EditAstromanModule from './editAstroman/editAstroman.module';
import DeleteAstromanModule from './deleteAstroman/deleteAstroman.module';
import GetSkillsModule from './getSkills/getSkills.module';
import AddSkillModule from './addSkill/addSkill.module';
import EditSkillModule from './editSkill/editSkill.module';
import DeleteSkillModule from './deleteSkill/deleteSkill.module';

@Module({
    imports: [
        GetAstromenModule,
        AddAstromanModule,
        EditAstromanModule,
        DeleteAstromanModule,
        GetSkillsModule,
        AddSkillModule,
        EditSkillModule,
        DeleteSkillModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
