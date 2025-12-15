import { Module } from '@nestjs/common';
import EditAstromanController from './editAstroman.controller';
import EditAstromanService from './editAstroman.service';
import DbModule from '../db/db.module';
import AddOrEditAstromanCommonModule from '../addOrEditAstromanCommon/addOrEditAstromanCommon.module';
import SkillsModule from '../skills/skills.module';

@Module({
    imports: [DbModule, AddOrEditAstromanCommonModule, SkillsModule],
    controllers: [EditAstromanController],
    providers: [EditAstromanService],
})
export default class EditAstromanModule {}
