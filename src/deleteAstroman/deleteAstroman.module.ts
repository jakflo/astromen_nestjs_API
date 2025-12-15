import { Module } from '@nestjs/common';
import DeleteAstromanController from './deleteAstroman.controller';
import DeleteAstromanService from './deleteAstroman.service';
import DbModule from '../db/db.module';
import SkillsModule from '../skills/skills.module';

@Module({
    imports: [DbModule, SkillsModule],
    controllers: [DeleteAstromanController],
    providers: [DeleteAstromanService],
})
export default class DeleteAstromanModule {}
