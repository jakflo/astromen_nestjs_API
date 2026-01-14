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
import { formateDateToIso } from '../src/utils/dateTools';
import { AddOrEditAstromanDataSoft } from './types';
import { TestContext } from './types';


describe('AddAstroman (e2e)', () => {
    const ctx = {} as TestContext;
    setupTestApp(ctx);

    it('/AddAstroman', async () => {
        const conn = ctx.db.getConn();
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);
        type respBody = {
            status: string;
            newItemId: number;
        };

        const data_1 = {
            firstName: 'fname_1',
            lastName: 'lname_1',
            dob: '1988-08-08',
            skills: [skillId_1, skillId_2],
        };

        const resp = await request(httpServerHelper(ctx.app))
            .post('/newAstroman')
            .send(data_1)
            .expect(201);
        const body = resp.body as respBody;
        expect(body.status).toEqual('new astroman inserted');
        const newItemId_1 = body.newItemId;

        const crudLoggerRecords = await getCrudLoggerRecords(
            newItemId_1,
            'c',
            'astroman',
            conn,
        );
        expect(crudLoggerRecords).toHaveLength(1);

        const newItemRecord_1 = await conn('astroman').where<
            AstromanDbRecord[]
        >('id', newItemId_1);
        const newItemSkills_1 = await getAstromanSkills(newItemId_1, conn);
        expect(newItemRecord_1[0].first_name).toEqual('fname_1');
        expect(newItemRecord_1[0].last_name).toEqual('lname_1');
        expect(formateDateToIso(newItemRecord_1[0].DOB)).toEqual('1988-08-08');
        expect(newItemSkills_1).toHaveLength(2);
        expect(newItemSkills_1).toContain(skillId_1);
        expect(newItemSkills_1).toContain(skillId_2);

        const newItemId_2 = await addAstroman(
            'fname_2',
            'lname_2',
            '1988-08-09',
            [skillId_1],
            ctx.app,
        );
        const newItemSkills_2 = await getAstromanSkills(newItemId_2, conn);
        expect(newItemSkills_2).toHaveLength(1);
        expect(newItemSkills_2).toContain(skillId_1);
    });

    it('/AddAstroman (validator)', async () => {
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);
        const wrongSkillId = skillId_1 + skillId_2;
        const tooLongName =
            'looooooooooooooooooooooooooooooooooooooooooooooooooooooong';
        const data: AddOrEditAstromanDataSoft = {
            firstName: 'fname_1', 
            lastName: 'lname_1', 
            dob: '1988-08-08', 
            skills: [skillId_1, skillId_2]
        };

        //chyby v firstName
        const data_fn = {...data, firstName: tooLongName}
        await testAddAstroman(data_fn, 400, ctx.app);
        data_fn.firstName = ' ';
        await testAddAstroman(data_fn, 400, ctx.app);
        delete data_fn.firstName;
        await testAddAstroman(data_fn, 400, ctx.app);

        //chyby v lastname
        const data_ln = {...data, lastName: tooLongName}
        await testAddAstroman(data_ln, 400, ctx.app);
        data_ln.lastName = ' ';
        await testAddAstroman(data_ln, 400, ctx.app);
        delete data_ln.lastName;
        await testAddAstroman(data_ln, 400, ctx.app);

        //chyby v datum narozeni
        const data_dob = {...data, dob: 'wrong'}
        await testAddAstroman(data_dob, 400, ctx.app);
        data_dob.dob = '1988-02-30';
        await testAddAstroman(data_dob, 400, ctx.app);
        data_dob.dob = '1987-02-29';
        await testAddAstroman(data_dob, 400, ctx.app);
        data_dob.dob = ' ';
        await testAddAstroman(data_dob, 400, ctx.app);
        delete data_dob.dob;
        await testAddAstroman(data_dob, 400, ctx.app);

        //chyby ve skills
        const data_sk = {...data, skills: [skillId_1, wrongSkillId]};
        await testAddAstroman(data_sk, 400, ctx.app);
        data_sk.skills = [wrongSkillId];
        await testAddAstroman(data_sk, 400, ctx.app);
        data_sk.skills = [];
        await testAddAstroman(data_sk, 400, ctx.app);
        delete data_sk.skills;
        await testAddAstroman(data_sk, 400, ctx.app);

        //vytvoreni stejne polozky 2x
        await testAddAstroman(data, 201, ctx.app);
        await testAddAstroman(data, 400, ctx.app);

        //tohle by melo projit
        const data_2 = {...data, firstName: 'fname_2'};
        await testAddAstroman(data_2, 201, ctx.app);
        const data_3 = {...data, dob: '1988-07-07'};
        await testAddAstroman(data_3, 201, ctx.app);
    });
});

async function testAddAstroman(data: AddOrEditAstromanDataSoft, expectedCode: number, app: INestApplication) {
    await request(httpServerHelper(app))
        .post('/newAstroman')
        .send(data)
        .expect(expectedCode);
}
