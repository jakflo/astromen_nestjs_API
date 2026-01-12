import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import DbService from '../src/db/db.service';
import { getCrudLoggerRecords, addAstroman, addSkill } from './tools';
import auxSetup from '../src/mainAuxSetup';
import type { SkillsListItem } from '../src/skills/skills.service';

describe('DeleteSkill (e2e)', () => {
    let app: INestApplication<App>;
    let db: DbService;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        auxSetup(app);
        await app.init();

        db = moduleFixture.get(DbService);
    });

    afterAll(async () => {
        await app.close();
        await db.getConn().destroy();
    });

    beforeEach(async () => {
        await db.startTransaction();
    });

    afterEach(async () => {
        await db.endTransaction(false);
    });

    it('/DeleteSkill', async () => {
        const conn = db.getConn();
        const skillId_1 = await addSkill('skill_1', app);
        const skillId_2 = await addSkill('skill_2', app);

        await request(app.getHttpServer())
            .delete(`/deleteSkill/${skillId_2}`)
            .send()
            .expect(200)
            .expect({
                status: 'skill deleted',
                id: skillId_2,
            });

        const skillRecord_1 = await conn('skill').where<SkillsListItem[]>(
            'id',
            skillId_1,
        );
        const skillRecord_2 = await conn('skill').where<SkillsListItem[]>(
            'id',
            skillId_2,
        );
        expect(skillRecord_1).toHaveLength(1);
        expect(skillRecord_2).toHaveLength(0);

        const crudLoggerRecords = await getCrudLoggerRecords(
            skillId_2,
            'd',
            'skill',
            conn,
        );
        expect(crudLoggerRecords).toHaveLength(1);
    });

    it('/DeleteSkill (validator)', async () => {
        const skillId_1 = await addSkill('skill_1', app);
        const skillId_2 = await addSkill('skill_2', app);
        const wrongSkillId = skillId_1 + skillId_2;

        // neexistujici id
        await testDeleteSkill(wrongSkillId, 404, app);

        // pokus o smazani jit pouzite dovednosti
        await addAstroman('f1', 'l1', '1988-08-08', [skillId_1], app);
        await testDeleteSkill(skillId_1, 400, app);

        await testDeleteSkill(skillId_2, 200, app);
    });
});

async function testDeleteSkill(
    skillId: number,
    expectedCode: number,
    app: INestApplication,
) {
    await request(app.getHttpServer())
        .delete(`/deleteSkill/${skillId}`)
        .send()
        .expect(expectedCode);
}
