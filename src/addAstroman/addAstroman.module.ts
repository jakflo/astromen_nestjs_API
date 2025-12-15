import { Module } from '@nestjs/common';
import AddAstromanController from './addAstroman.controller';
import AddAstromanService from './addAstroman.service';
import DbModule from '../db/db.module';
import AddOrEditAstromanCommonModule from '../addOrEditAstromanCommon/addOrEditAstromanCommon.module';
import SkillsModule from '../skills/skills.module';

@Module({
    imports: [DbModule, AddOrEditAstromanCommonModule, SkillsModule],
    controllers: [AddAstromanController],
    providers: [AddAstromanService],
})
export default class AddAstromanModule {}
