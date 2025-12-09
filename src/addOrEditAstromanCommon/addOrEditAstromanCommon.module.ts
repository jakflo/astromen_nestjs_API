import { Module } from '@nestjs/common';
import AddOrEditAstromanCommonService from './addOrEditAstromanCommon.service';
import DbModule from '../db/db.module';
import SkillsModule from '../skills/skills.module';
import SkillsExistValidator from './validator/SkillsExistValidator';

@Module({
    imports: [DbModule, SkillsModule],
    providers: [AddOrEditAstromanCommonService, SkillsExistValidator],
    exports: [AddOrEditAstromanCommonService, SkillsExistValidator],
})
export default class AddOrEditAstromanCommonModule {}
