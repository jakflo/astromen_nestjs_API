import { Module } from '@nestjs/common';
import EditSkillController from './editSkill.controller';
import EditSkillService from './editSkill.service';
import DbModule from '../db/db.module';
import SkillsModule from '../skills/skills.module';
import CrudLoggerModule from '../crudLogger/crudLogger.module';

@Module({
    imports: [DbModule, SkillsModule, CrudLoggerModule],
    controllers: [EditSkillController],
    providers: [EditSkillService],
})
export default class EditSkillModule {}
