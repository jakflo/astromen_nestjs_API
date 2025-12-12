import { Module } from '@nestjs/common';
import DeleteSkillController from './deleteSkill.controller';
import DeleteSkillService from './deleteSkill.service';
import DbModule from '../db/db.module';
import CrudLoggerModule from '../crudLogger/crudLogger.module';

@Module({
    imports: [DbModule, CrudLoggerModule],
    controllers: [DeleteSkillController],
    providers: [DeleteSkillService],
})
export default class DeleteSkillModule {}
