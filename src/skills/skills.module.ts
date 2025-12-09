import { Module } from '@nestjs/common';
import SkillsController from './skills.controller';
import SkillsService from './skills.service';
import DbModule from '../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [SkillsController],
    providers: [SkillsService],
    exports: [SkillsService],
})
export default class SkillsModule {}
