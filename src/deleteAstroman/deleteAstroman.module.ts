import { Module } from '@nestjs/common';
import DeleteAstromanController from './deleteAstroman.controller';
import DeleteAstromanService from './deleteAstroman.service';
import DbModule from '../db/db.module';
import SkillsModule from '../skills/skills.module';
import CrudLoggerModule from '../crudLogger/crudLogger.module';

@Module({
    imports: [DbModule, SkillsModule, CrudLoggerModule],
    controllers: [DeleteAstromanController],
    providers: [DeleteAstromanService],
})
export default class DeleteAstromanModule {}
