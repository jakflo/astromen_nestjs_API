import { Module } from '@nestjs/common';
import AddAstromanController from './addAstroman.controller';
import AddAstromanService from './addAstroman.service';
import DbModule from '../db/db.module';
import AddOrEditAstromanCommonModule from '../addOrEditAstromanCommon/addOrEditAstromanCommon.module';
import SkillsModule from '../skills/skills.module';
import CrudLoggerModule from '../crudLogger/crudLogger.module';

@Module({
    imports: [
        DbModule,
        AddOrEditAstromanCommonModule,
        SkillsModule,
        CrudLoggerModule,
    ],
    controllers: [AddAstromanController],
    providers: [AddAstromanService],
})
export default class AddAstromanModule {}
