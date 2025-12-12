import { Module } from '@nestjs/common';
import SkillsService from './skills.service';
import DbModule from '../db/db.module';

@Module({
    imports: [DbModule],
    providers: [SkillsService],
    exports: [SkillsService],
})
export default class SkillsModule {}
