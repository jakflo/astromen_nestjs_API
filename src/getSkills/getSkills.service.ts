import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import SkillResponseDto from '../skills/dto/SkillResponseDto';

@Injectable()
export default class GetSkillsService {
    constructor(private readonly db: DbService) {}

    async getSkillsList(): Promise<SkillResponseDto[]> {
        const conn = this.db.getConn();

        return <SkillResponseDto[]>(
            await conn('skill').select('id', 'name').orderBy('id')
        );
    }
}
