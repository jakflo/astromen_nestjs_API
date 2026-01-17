import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
    getCrudLoggerRecords,
    addSkill,
    setupTestApp,
    httpServerHelper,
} from './tools';
import type { SkillsListItem } from '../src/skills/skills.service';
import { TestContext } from './types';

describe('AddSkill (e2e)', () => {
    const ctx = {} as TestContext;
    setupTestApp(ctx);

    it('/editSkill (1 polozka)', async () => {
        const conn = ctx.db.getConn();
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);

        await request(httpServerHelper(ctx.app))
            .put(`/editSkill/${skillId_2}`)
            .send({ name: 'skill_2b' })
            .expect(200)
            .expect({
                status: 'skill edited',
                id: skillId_2,
            });
        await request(httpServerHelper(ctx.app))
            .put(`/editSkill/${skillId_2}`)
            .send({ name: 'skill_2b' })
            .expect(200)
            .expect({
                status: 'no change in skill detected, nothing was saved',
                id: skillId_2,
            });

        const crudLoggerRecords = await getCrudLoggerRecords(
            skillId_2,
            'u',
            'skill',
            conn,
        );
        expect(crudLoggerRecords).toHaveLength(1);

        const skillRecord_1 = await conn('skill').where<SkillsListItem[]>(
            'id',
            skillId_1,
        );
        const skillRecord_2 = await conn('skill').where<SkillsListItem[]>(
            'id',
            skillId_2,
        );
        expect(skillRecord_1[0].name).toEqual('skill_1');
        expect(skillRecord_2[0].name).toEqual('skill_2b');
    });

    it('/editSkill (validators)', async () => {
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);
        const wrongSkillId = skillId_1 + skillId_2;

        //neexistujici id
        await testEditSkill(wrongSkillId, 'skill_2b', 404, ctx.app);

        //chybi jmeno
        await testEditSkill(skillId_1, null, 400, ctx.app);
        await testEditSkill(skillId_1, ' ', 400, ctx.app);

        //prilis dlouhe jmeno
        await testEditSkill(
            skillId_1,
            'skill_too_looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
            400,
            ctx.app,
        );

        //pouzite jmeno
        await testEditSkill(skillId_1, 'skill_2', 400, ctx.app);

        //pouzite jmeno, ale stejne id, tudiz edit bez zmeny
        await testEditSkill(skillId_2, 'skill_2', 200, ctx.app);

        //korektni request
        await testEditSkill(skillId_2, 'skill_2b', 200, ctx.app);
    });
});

async function testEditSkill(
    id: number,
    name: string | null,
    expectedCode: number,
    app: INestApplication,
) {
    let data: { name?: string };
    if (name === null) {
        data = {};
    } else {
        data = { name };
    }

    await request(httpServerHelper(app))
        .put(`/editSkill/${id}`)
        .send(data)
        .expect(expectedCode);
}
