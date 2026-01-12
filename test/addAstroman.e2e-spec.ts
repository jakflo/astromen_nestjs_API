import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import DbService from '../src/db/db.service';
import { getCrudLoggerRecords, getAstromanSkills, addAstroman, addSkill } from './tools';
import type { AstromanDbRecord } from '../src/getAstromen/getAstromen.service';
import auxSetup from '../src/mainAuxSetup';
import { formateDateToIso } from '../src/utils/dateTools';

describe('AddAstroman (e2e)', () => {
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

    it('/AddAstroman', async () => {
        const conn = db.getConn();
        const skillId_1 = await addSkill('skill_1', app);
        const skillId_2 = await addSkill('skill_2', app);
        type respBody = {
            status: string;
            newItemId: number;
        };
        
        const data_1 = {
            firstName: 'fname_1',
            lastName: 'lname_1',
            dob: '1988-08-08',
            skills: [skillId_1, skillId_2]
        };

        const resp = await request(app.getHttpServer())
            .post('/newAstroman')
            .send(data_1)
            .expect(201)
        ;        

        const body = resp.body as respBody;
        expect(body.status).toEqual('new astroman inserted');
        const newItemId_1 = body.newItemId;

        const crudLoggerRecords = await getCrudLoggerRecords(newItemId_1, 'c', 'astroman', conn);
        expect(crudLoggerRecords).toHaveLength(1);

        const newItemRecord_1 = await conn('astroman').where<AstromanDbRecord>('id', newItemId_1);
        const newItemSkills_1 = await getAstromanSkills(newItemId_1, conn);
        expect(newItemRecord_1[0].first_name).toEqual('fname_1');
        expect(newItemRecord_1[0].last_name).toEqual('lname_1');
        expect(formateDateToIso(newItemRecord_1[0].DOB)).toEqual('1988-08-08');
        expect(newItemSkills_1).toHaveLength(2);
        expect(newItemSkills_1).toContain(skillId_1);
        expect(newItemSkills_1).toContain(skillId_2);

        const newItemId_2 = await addAstroman('fname_2', 'lname_2', '1988-08-09', [skillId_1], app);
        const newItemSkills_2 = await getAstromanSkills(newItemId_2, conn);
        expect(newItemSkills_2).toHaveLength(1);
        expect(newItemSkills_2).toContain(skillId_1);
    });

    it('/AddAstroman (validator)', async () => {
        const skillId_1 = await addSkill('skill_1', app);
        const skillId_2 = await addSkill('skill_2', app);
        const wrongSkillId = skillId_1 + skillId_2;
        const tooLongName = 'looooooooooooooooooooooooooooooooooooooooooooooooooooooong';

        //chyby v firstName
        await testAddAstroman(null, 'lname_1', '1988-08-08', [skillId_1, skillId_2], 400, app);
        await testAddAstroman(' ', 'lname_1', '1988-08-08', [skillId_1, skillId_2], 400, app);
        await testAddAstroman(tooLongName, 'lname_1', '1988-08-08', [skillId_1, skillId_2], 400, app);

        //chyby v lastname
        await testAddAstroman('fname_1', null, '1988-08-08', [skillId_1, skillId_2], 400, app);
        await testAddAstroman('fname_1', ' ', '1988-08-08', [skillId_1, skillId_2], 400, app);
        await testAddAstroman('fname_1', tooLongName, '1988-08-08', [skillId_1, skillId_2], 400, app);

        //chyby v datum narozeni
        await testAddAstroman('fname_1', 'lname_1', null, [skillId_1, skillId_2], 400, app);
        await testAddAstroman('fname_1', 'lname_1', '', [skillId_1, skillId_2], 400, app);
        await testAddAstroman('fname_1', 'lname_1', 'wrong', [skillId_1, skillId_2], 400, app);
        await testAddAstroman('fname_1', 'lname_1', '1988-02-30', [skillId_1, skillId_2], 400, app);
        await testAddAstroman('fname_1', 'lname_1', '1987-02-29', [skillId_1, skillId_2], 400, app);

        //chyby ve skills
        await testAddAstroman('fname_1', 'lname_1', '1988-08-29', null, 400, app);
        await testAddAstroman('fname_1', 'lname_1', '1988-08-29', [], 400, app);
        await testAddAstroman('fname_1', 'lname_1', '1988-08-29', [skillId_1, wrongSkillId], 400, app);
        await testAddAstroman('fname_1', 'lname_1', '1988-08-29', [wrongSkillId], 400, app);

        //vytvoreni stejne polozky 2x
        await testAddAstroman('fname_1', 'lname_1', '1988-08-29', [skillId_1, skillId_2], 201, app);
        await testAddAstroman('fname_1', 'lname_1', '1988-08-29', [skillId_1, skillId_2], 400, app);
        //tohle by melo projit
        await testAddAstroman('fname_2', 'lname_1', '1988-08-29', [skillId_1, skillId_2], 201, app);
        await testAddAstroman('fname_1', 'lname_1', '1988-08-30', [skillId_1, skillId_2], 201, app);
    });

});

async function testAddAstroman(
    firstName: string | null,
    lastName: string | null,
    dob: string | null,
    skills: number[] | null, 
    expectedCode: number, 
    app: INestApplication
) {
    let data: {
        firstName?: string,
        lastName?: string,
        dob?: string,
        skills?: number[]
    } = {};

    if (firstName !== null) {
        data.firstName = firstName;
    }
    if (lastName !== null) {
        data.lastName = lastName;
    }
    if (dob !== null) {
        data.dob = dob;
    }
    if (skills !== null) {
        data.skills = skills;
    }

    await request(app.getHttpServer())
        .post('/newAstroman')
        .send(data)
        .expect(expectedCode)
    ;
}
