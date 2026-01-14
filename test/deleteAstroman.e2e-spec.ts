import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
    getCrudLoggerRecords,
    getAstromanSkills,
    addAstroman,
    addSkill,
    setupTestApp,
    httpServerHelper
} from './tools';
import type { AstromanDbRecord } from '../src/getAstromen/getAstromen.service';
import { TestContext } from './types';

describe('DeleteAstroman (e2e)', () => {
    const ctx = {} as TestContext;
    setupTestApp(ctx);

    it('/DeleteAstroman', async () => {
        const conn = ctx.db.getConn();
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);
        type respBody = {
            status: string;
            itemId: number;
        };

        const newItemId_1 = await addAstroman('fname_1', 'lname_1', '1988-08-08', [skillId_1, skillId_2], ctx.app);
        const newItemId_2 = await addAstroman('fname_2', 'lname_2', '1988-07-07', [skillId_2], ctx.app);

        const resp = await request(httpServerHelper(ctx.app))
            .delete(`/deleteAstroman/${newItemId_1}`)
            .send()
            .expect(200);
        const body = resp.body as respBody;
        expect(body.status).toEqual('astroman successfully deleted');
        expect(body.itemId).toEqual(newItemId_1);

        const newItemRecord_1 = await conn('astroman').where<AstromanDbRecord[]>('id', newItemId_1);
        expect(newItemRecord_1).toHaveLength(0);
        const newItemRecord_2 = await conn('astroman').where<AstromanDbRecord[]>('id', newItemId_2);
        expect(newItemRecord_2).toHaveLength(1);

        const newItemSkills_1 = await getAstromanSkills(newItemId_1, conn);
        expect(newItemSkills_1).toHaveLength(0);

        const crudLoggerRecords = await getCrudLoggerRecords(newItemId_1, 'd', 'astroman', conn);
        expect(crudLoggerRecords).toHaveLength(1);
    });

    it('/DeleteAstroman (validator)', async () => {
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const newItemId = await addAstroman('fname_1', 'lname_1', '1988-08-08', [skillId_1], ctx.app);
        const wrongItemId = newItemId + 1;
        await testDeleteAstroman(wrongItemId, 404, ctx.app);
        await testDeleteAstroman(newItemId, 200, ctx.app);
    });

});

async function testDeleteAstroman(id: number, expectedCode: number, app: INestApplication) {
    await request(httpServerHelper(app))
        .delete(`/deleteAstroman/${id}`)
        .send()
        .expect(expectedCode);
}
