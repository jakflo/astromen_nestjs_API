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

    it('/editSkill (1 polozka)', async () => {
        const conn = db.getConn();
        const skillId_1 = await addSkill('skill_1', app);
        const skillId_2 = await addSkill('skill_2', app);

        await request(app.getHttpServer())
            .put(`/editSkill/${skillId_2}`)
            .send({ name: 'skill_2b' })
            .expect(200)
            .expect({
                status: 'skill edited',
                id: skillId_2
            })
        ;
        await request(app.getHttpServer())
            .put(`/editSkill/${skillId_2}`)
            .send({ name: 'skill_2b' })
            .expect(200)
            .expect({
                status: 'no change in skill detected, nothig was saved',
                id: skillId_2
            })
        ;

        const crudLoggerRecords = await getCrudLoggerRecords(skillId_2, 'u', 'skill', conn);
        expect(crudLoggerRecords).toHaveLength(1);

        const skillRecord_1 = await conn('skill').where<SkillsListItem[]>('id', skillId_1);
        const skillRecord_2 = await conn('skill').where<SkillsListItem[]>('id', skillId_2);
        expect(skillRecord_1[0].name).toEqual('skill_1');
        expect(skillRecord_2[0].name).toEqual('skill_2b');
    });

    it('/editSkill (validators)', async () => {
        const skillId_1 = await addSkill('skill_1', app);
        const skillId_2 = await addSkill('skill_2', app);
        const wrongSkillId = skillId_1 + skillId_2;

        //neexistujici id
        await testEditSkill(wrongSkillId, 'skill_2b', 404, app);

        //chybi jmeno
        await testEditSkill(skillId_1, null, 400, app);
        await testEditSkill(skillId_1, ' ', 400, app);

        //prilis dlouhe jmeno
        await testEditSkill(skillId_1, 'skill_too_looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong', 400, app);

        //pouzite jmeno
        await testEditSkill(skillId_1, 'skill_2', 400, app);

        //pouzite jmeno, ale stejne id, tudiz edit bez zmeny
        await testEditSkill(skillId_2, 'skill_2', 200, app);

        //korektni request
        await testEditSkill(skillId_2, 'skill_2b', 200, app);
    });
});

async function testEditSkill(
    id: number, 
    name: string | null, 
    expectedCode: number, 
    app: INestApplication
) {
    let data: {name?: string};
    if (name === null) {
        data = {};
    } else {
        data = { name };
    }

    await request(app.getHttpServer())
        .put(`/editSkill/${id}`)
        .send(data)
        .expect(expectedCode)
    ;
}
