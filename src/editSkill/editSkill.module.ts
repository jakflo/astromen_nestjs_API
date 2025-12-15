import { Module } from '@nestjs/common';
import EditSkillController from './editSkill.controller';
import EditSkillService from './editSkill.service';
import DbModule from '../db/db.module';
import SkillsModule from '../skills/skills.module';

@Module({
    imports: [DbModule, SkillsModule],
    controllers: [EditSkillController],
    providers: [EditSkillService],
})
export default class EditSkillModule {}
