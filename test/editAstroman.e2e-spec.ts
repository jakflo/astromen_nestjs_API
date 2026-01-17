import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
    getCrudLoggerRecords,
    addAstroman,
    addSkill,
    setupTestApp,
    httpServerHelper, 
    compareAstromanItemWithDb
} from './tools';
import { AddOrEditAstromanDataSoft } from './types';
import { TestContext, AstromanData } from './types';

describe('EditAstroman (e2e)', () => {
    const ctx = {} as TestContext;
    setupTestApp(ctx);

    it('/EditAstroman', async () => {
        const conn = ctx.db.getConn();
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);

        const data_1: AstromanData = {
            firstName: 'fname_1', 
            lastName: 'lname_1', 
            dob: '1988-08-08', 
            skills: [skillId_1, skillId_2]
        };
        const data_2: AstromanData = {
            firstName: 'fname_2', 
            lastName: 'lname_2', 
            dob: '1988-08-09', 
            skills: [skillId_1]
        };
        const newItemId_1 = await addAstroman(data_1.firstName, data_1.lastName, data_1.dob, data_1.skills, ctx.app);
        const newItemId_2 = await addAstroman(data_2.firstName, data_2.lastName, data_2.dob, data_2.skills, ctx.app);

        //zmenime zakladni data i skills
        const data_1b = {
            firstName: 'fname_1b',
            lastName: 'lname_1b',
            dob: '1988-07-07',
            skills: [skillId_2]
        };
        
        await testGoodEditAstroman(newItemId_1, data_1b, 'changes in astroman were successfully saved', ctx.app);
        await compareAstromanItemWithDb(newItemId_1, data_1b, conn);
        await compareAstromanItemWithDb(newItemId_2, data_2, conn);
        let crudLoggerRecords = await getCrudLoggerRecords(newItemId_1, 'u', 'astroman', conn);
        expect(crudLoggerRecords).toHaveLength(1);

        //nezmenime nic
        await testGoodEditAstroman(newItemId_2, data_2, 'no change in astroman detected, nothig was saved', ctx.app);
        await compareAstromanItemWithDb(newItemId_1, data_1b, conn);
        await compareAstromanItemWithDb(newItemId_2, data_2, conn);
        crudLoggerRecords = await getCrudLoggerRecords(newItemId_2, 'u', 'astroman', conn);
        expect(crudLoggerRecords).toHaveLength(0);

        //zmenime pouze skills
        const data_2b = {
            ...data_2, 
            skills: [skillId_1, skillId_2]
        };
        await testGoodEditAstroman(newItemId_2, data_2b, 'changes in astroman were successfully saved', ctx.app);
        await compareAstromanItemWithDb(newItemId_1, data_1b, conn);
        await compareAstromanItemWithDb(newItemId_2, data_2b, conn);
        crudLoggerRecords = await getCrudLoggerRecords(newItemId_2, 'u', 'astroman', conn);
        expect(crudLoggerRecords).toHaveLength(1);

        //zmenime pouze zakladni data
        const data_1c = {
            ...data_1, 
            skills: [skillId_2]
        };
        await testGoodEditAstroman(newItemId_1, data_1c, 'changes in astroman were successfully saved', ctx.app);
        await compareAstromanItemWithDb(newItemId_1, data_1c, conn);
        await compareAstromanItemWithDb(newItemId_2, data_2b, conn);
        crudLoggerRecords = await getCrudLoggerRecords(newItemId_1, 'u', 'astroman', conn);
        expect(crudLoggerRecords).toHaveLength(2);
    });

    it('/EditAstroman (validator)', async () => {
        const skillId_1 = await addSkill('skill_1', ctx.app);
        const skillId_2 = await addSkill('skill_2', ctx.app);
        const wrongSkillId = skillId_1 + skillId_2;

        const data: AddOrEditAstromanDataSoft = {
            firstName: 'fname_1', 
            lastName: 'lname_1', 
            dob: '1988-08-08', 
            skills: [skillId_1, skillId_2]
        };
        const newItemId_1 = await addAstroman(data.firstName, data.lastName, data.dob, data.skills, ctx.app);
        const newItemId_2 = await addAstroman('fname_2', 'lname_2', '1988-07-07', [skillId_2], ctx.app);
        const wrongItemId = newItemId_1 + newItemId_2;
        const tooLongName = 'too loooooooooooooooooooooooooooooooooooooooooooooooooooooong';

        //spatne id
        await testEditAstroman(wrongItemId, data, 404, ctx.app);

        //spatne fname
        const data_fn = {...data, firstName: tooLongName}
        await testEditAstroman(newItemId_1, data_fn, 400, ctx.app);
        data_fn.firstName = ' ';
        await testEditAstroman(newItemId_1, data_fn, 400, ctx.app);
        delete data_fn.firstName;
        await testEditAstroman(newItemId_1, data_fn, 400, ctx.app);

        //spatne lname
        const data_ln = {...data, lastName: tooLongName}
        await testEditAstroman(newItemId_1, data_ln, 400, ctx.app);
        data_ln.lastName = ' ';
        await testEditAstroman(newItemId_1, data_ln, 400, ctx.app);
        delete data_ln.lastName;
        await testEditAstroman(newItemId_1, data_ln, 400, ctx.app);

        //spatny datum narozeni
        const data_dob = {...data, dob: 'wrong'}
        await testEditAstroman(newItemId_1, data_dob, 400, ctx.app);
        data_dob.dob = '1988-02-30';
        await testEditAstroman(newItemId_1, data_dob, 400, ctx.app);
        data_dob.dob = '1987-02-29';
        await testEditAstroman(newItemId_1, data_dob, 400, ctx.app);
        data_dob.dob = ' ';
        await testEditAstroman(newItemId_1, data_dob, 400, ctx.app);
        delete data_dob.dob;
        await testEditAstroman(newItemId_1, data_dob, 400, ctx.app);

        //spatne skills
        const data_sk = {...data, skills: [skillId_1, wrongSkillId]};
        await testEditAstroman(newItemId_1, data_sk, 400, ctx.app);
        data_sk.skills = [];
        await testEditAstroman(newItemId_1, data_sk, 400, ctx.app);
        delete data_sk.skills;
        await testEditAstroman(newItemId_1, data_sk, 400, ctx.app);

        //prepisem by vznikly duplicidni polozky
        await testEditAstroman(newItemId_2, data, 400, ctx.app);
        //tohle uz dobre
        await testEditAstroman(newItemId_1, data, 200, ctx.app);
    });
});

//zde pocitam s korektnim requestem
async function testGoodEditAstroman(id: number, data: AstromanData, expectedStatus: string, app: INestApplication) {
    type respBody = {
        status: string;
        itemId: number;
    };

    const resp = await request(httpServerHelper(app))
        .put(`/editAstroman/${id}`)
        .send(data)
        .expect(200);
    const body = resp.body as respBody;
    expect(body.status).toEqual(expectedStatus);
    expect(body.itemId).toEqual(id);
}

//a zde mohou byt nekorektni requesty
async function testEditAstroman(id: number, data: AddOrEditAstromanDataSoft, expectedCode: number, app: INestApplication) {
    await request(httpServerHelper(app))
        .put(`/editAstroman/${id}`)
        .send(data)
        .expect(expectedCode);
}
