import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import DbService from '../src/db/db.service';
import { getCrudLoggerRecords, addSkill } from './tools';
import auxSetup from '../src/mainAuxSetup';
import type { SkillsListItem } from '../src/skills/skills.service';

describe('AddSkill (e2e)', () => {
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

    it('/addSkill (1 polozka)', async () => {
        const conn = db.getConn();

        const name = 'skill_1';
        const newSkillId = await addSkill(name, app);

        const newSkillRecords = await conn('skill').where<SkillsListItem[]>('name', name);
        expect(newSkillRecords).toHaveLength(1);
        expect(newSkillId).toEqual(newSkillRecords[0]['id']);
        
        const crudLoggerRecords = await getCrudLoggerRecords(newSkillRecords[0]['id'], 'c', 'skill', conn);
        expect(crudLoggerRecords).toHaveLength(1);
    });

    it('/addSkill (10 polozek)', async () => {
        const conn = db.getConn();

        for (let c = 1; c <= 10; c++) {
            await addSkill(`skill_${c}`, app);
        }

        const skillRecords = await conn('skill');
        expect(skillRecords).toHaveLength(10);
    });

    it('/addSkill (validator)', async () => {
        await testAddSkill('skill_1', 201, app);
        await testAddSkill('skill_2', 201, app);
        
        //chybejici nebo prazdne jmeno
        await testAddSkill(null, 400, app);
        await testAddSkill('  ', 400, app);
        
        //po druhe stejne jmeno, musi selhat
        await testAddSkill('skill_2', 400, app);

        //prilis dlouhe jmeno
        await testAddSkill('skill_looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog_name', 400, app);
    });
});

async function testAddSkill(name: string | null, expectedCode: number, app: INestApplication) {
    let data: {name?: string};
    if (name === null) {
        data = {};
    } else {
        data = { name };
    }

    await request(app.getHttpServer())
        .post('/addSkill')
        .send(data)
        .expect(expectedCode)
    ;
}
