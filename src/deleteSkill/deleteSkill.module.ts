import { Module } from '@nestjs/common';
import DeleteSkillController from './deleteSkill.controller';
import DeleteSkillService from './deleteSkill.service';
import DbModule from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [DeleteSkillController],
    providers: [DeleteSkillService],
})
export default class DeleteSkillModule {}
