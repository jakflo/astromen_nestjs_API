import { Knex } from 'knex';
import type {
    Crud,
    CrudLoggerRecord,
} from '../src/crudLogger/crudLogger.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import auxSetup from '../src/mainAuxSetup';
import DbService from '../src/db/db.service';
import { TestContext } from './types';
import { Server } from 'http';

//spolecne pro vsechny testy - iniciuje se app a db a kazda test se obali rollnutou transakci
function setupTestApp(ctx: TestContext) {
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    ctx.app = moduleFixture.createNestApplication();
    auxSetup(ctx.app);
    await ctx.app.init();

    ctx.db = moduleFixture.get(DbService);
  });

  afterAll(async () => {
    await ctx.app.close();
    await ctx.db.getConn().destroy();
  });

  beforeEach(async () => {
    await ctx.db.startTransaction();
  });

  afterEach(async () => {
    await ctx.db.endTransaction(false);
  });
}

function httpServerHelper(app: INestApplication): Server {
  return app.getHttpServer() as Server;
}

async function getCrudLoggerRecords(
    tableId: number,
    crud: Crud,
    tableName: string,
    conn: Knex | Knex.Transaction,
): Promise<Array<CrudLoggerRecord>> {
    return await conn('crud_logger')
        .select('crud_logger.*')
        .join(
            'crud_logger_table',
            'crud_logger.table_id',
            '=',
            'crud_logger_table.id',
        )
        .where('crud_logger.item_id', tableId)
        .andWhere('crud_logger.crud', crud)
        .andWhere<Array<CrudLoggerRecord>>('crud_logger_table.name', tableName);
}

async function getAstromanSkills(
    astromanId: number,
    conn: Knex | Knex.Transaction,
): Promise<Array<number>> {
    type RecordType = { skill_id: number };
    const records = await conn('astroman_has_skill')
        .select('skill_id')
        .where<RecordType[]>('astroman_id', astromanId);
    return records.map((item: RecordType) => {
        return item.skill_id;
    });
}

async function addAstroman(
    firstName: string,
    lastName: string,
    dob: string,
    skills: number[],
    app: INestApplication,
): Promise<number> {
    type respBody = {
        status: string;
        newItemId: number;
    };
    const data = { firstName, lastName, dob, skills };

    const resp = await request(httpServerHelper(app))
        .post('/newAstroman')
        .send(data)
        .expect(201);
    const body = resp.body as respBody;
    return body.newItemId;
}

async function deleteAstroman(id: number, app: INestApplication) {
    await request(httpServerHelper(app))
        .delete(`/deleteAstroman/${id}`)
        .send()
        .expect(200);
}

async function addSkill(name: string, app: INestApplication): Promise<number> {
    type respBody = {
        status: string;
        newSkillId: number;
    };

    const resp = await request(httpServerHelper(app))
        .post('/addSkill')
        .send({ name })
        .expect(201);
    const body = resp.body as respBody;

    return body.newSkillId;
}

export { setupTestApp, httpServerHelper, getCrudLoggerRecords, getAstromanSkills, addAstroman, addSkill, deleteAstroman };
