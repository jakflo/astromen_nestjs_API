import { Module } from '@nestjs/common';
import AddSkillController from './addSkill.controller';
import AddSkillService from './addSkill.service';
import DbModule from '../db/db.module';
import SkillsModule from '../skills/skills.module';
import CrudLoggerModule from '../crudLogger/crudLogger.module';

@Module({
    imports: [DbModule, SkillsModule, CrudLoggerModule],
    controllers: [AddSkillController],
    providers: [AddSkillService],
})
export default class AddSkillModule {}
