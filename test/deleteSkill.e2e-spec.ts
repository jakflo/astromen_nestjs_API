import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getCrudLoggerRecords, addAstroman, addSkill, deleteAstroman, setupTestApp, httpServerHelper } from './tools';
import type { SkillsListItem } from '../src/skills/skills.service';
import { TestContext } from './types';

describe('DeleteSkill (e2e)', () => {
    const ctx = {} as TestContext;
    setupTestApp(ctx);

    it('/DeleteSkill', async () => {
        const conn = ctx.db.getConn();
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);

        await request(httpServerHelper(ctx.app))
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
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);
        const wrongSkillId = skillId_1 + skillId_2;

        // neexistujici id
        await testDeleteSkill(wrongSkillId, 404, ctx.app);

        // pokus o smazani jiz pouzite dovednosti
        const newItemId =  await addAstroman('f1', 'l1', '1988-08-08', [skillId_1], ctx.app);
        await testDeleteSkill(skillId_1, 400, ctx.app);
        await deleteAstroman(newItemId, ctx.app);
        await testDeleteSkill(skillId_1, 200, ctx.app);

        await testDeleteSkill(skillId_2, 200, ctx.app);
    });
});

async function testDeleteSkill(
    skillId: number,
    expectedCode: number,
    app: INestApplication,
) {
    await request(httpServerHelper(app))
        .delete(`/deleteSkill/${skillId}`)
        .send()
        .expect(expectedCode);
}
