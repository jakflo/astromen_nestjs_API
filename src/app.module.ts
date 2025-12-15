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
import CrudLoggerModule from './crudLogger/crudLogger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
        CrudLoggerModule,
        EventEmitterModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
