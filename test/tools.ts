import { Knex } from 'knex';
import type { Crud, CrudLoggerRecord } from '../src/crudLogger/crudLogger.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

async function getCrudLoggerRecords(
    tableId: number, 
    crud: Crud, 
    tableName:string, 
    conn: Knex | Knex.Transaction
): Promise<Array<CrudLoggerRecord>> {
    return await 
        conn('crud_logger')
        .select('crud_logger.*')
        .join('crud_logger_table', 'crud_logger.table_id', '=', 'crud_logger_table.id')
        .where('crud_logger.item_id', tableId)
        .andWhere('crud_logger.crud', crud)
        .andWhere<Array<CrudLoggerRecord>>('crud_logger_table.name', tableName)
    ;
}

async function getAstromanSkills(astromanId: number, conn: Knex | Knex.Transaction): Promise<Array<number>> {
    type RecordType = { skill_id: number; };
    const records = await 
        conn('astroman_has_skill')
        .select('skill_id')
        .where<RecordType[]>('astroman_id', astromanId)
    ;
    return records.map((item: RecordType) => { return item.skill_id; });
}

async function addAstroman(
    firstName: string,
    lastName: string,
    dob: string,
    skills: number[], 
    app: INestApplication
): Promise<number> {
    type respBody = {
        status: string;
        newItemId: number;
    };
    const data = { firstName, lastName, dob, skills };

    const resp = await request(app.getHttpServer())
        .post('/newAstroman')
        .send(data)
        .expect(201)
    ;

    const body = resp.body as respBody;
    return body.newItemId;
}

async function addSkill(name: string, app: INestApplication): Promise<number> {
    type respBody = {
        status: string;
        newSkillId: number;
    };
    
    const resp = await request(app.getHttpServer())
        .post('/addSkill')
        .send({ name })
        .expect(201)
    ;
    const body = resp.body as respBody;

    return body.newSkillId;
}

export { getCrudLoggerRecords, getAstromanSkills, addAstroman, addSkill };
