import { Module } from '@nestjs/common';
import AddSkillController from './addSkill.controller';
import AddSkillService from './addSkill.service';
import DbModule from '../db/db.module';
import SkillsModule from '../skills/skills.module';

@Module({
    imports: [DbModule, SkillsModule],
    controllers: [AddSkillController],
    providers: [AddSkillService],
})
export default class AddSkillModule {}
