import { Module } from '@nestjs/common';
import GetSkillsController from './getSkills.controller';
import GetSkillsService from './getSkills.service';
import DbModule from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [GetSkillsController],
    providers: [GetSkillsService],
})
export default class GetSkillsModule {}
