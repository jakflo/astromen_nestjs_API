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

    it('/addSkill (1 polozka)', async () => {
        const conn = ctx.db.getConn();

        const name = 'skill_1';
        const newSkillId = await addSkill(name, ctx.app);

        const newSkillRecords = await conn('skill').where<SkillsListItem[]>(
            'name',
            name,
        );
        expect(newSkillRecords).toHaveLength(1);
        expect(newSkillId).toEqual(newSkillRecords[0]['id']);

        const crudLoggerRecords = await getCrudLoggerRecords(
            newSkillRecords[0]['id'],
            'c',
            'skill',
            conn,
        );
        expect(crudLoggerRecords).toHaveLength(1);
    });

    it('/addSkill (10 polozek)', async () => {
        const conn = ctx.db.getConn();

        for (let c = 1; c <= 10; c++) {
            await addSkill(`skill_${c}`, ctx.app);
        }

        const skillRecords = await conn('skill');
        expect(skillRecords).toHaveLength(10);
    });

    it('/addSkill (validator)', async () => {
        await testAddSkill('skill_1', 201, ctx.app);
        await testAddSkill('skill_2', 201, ctx.app);

        //chybejici nebo prazdne jmeno
        await testAddSkill(null, 400, ctx.app);
        await testAddSkill('  ', 400, ctx.app);

        //po druhe stejne jmeno, musi selhat
        await testAddSkill('skill_2', 400, ctx.app);

        //prilis dlouhe jmeno
        await testAddSkill(
            'skill_looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog_name',
            400,
            ctx.app,
        );
    });
});

async function testAddSkill(
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
        .post('/addSkill')
        .send(data)
        .expect(expectedCode);
}
