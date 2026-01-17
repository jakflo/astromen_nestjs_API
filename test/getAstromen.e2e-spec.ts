import request from 'supertest';
import {
    addSkill,
    setupTestApp,
    httpServerHelper,
    addAstroman,
    compareAstromanItemWithDb,
} from './tools';
import { TestContext, AstromanData } from './types';
import { itemsPerPage } from '../src/config';
import { INestApplication } from '@nestjs/common';
import { formateDateToIso } from '../src/utils/dateTools';
import type {
    GetAstromenOutput,
    AstromanRecord,
} from '../src/getAstromen/getAstromen.service';
import { Knex } from 'knex';

describe('/getAstromen (e2e)', () => {
    const ctx = {} as TestContext;
    setupTestApp(ctx);

    const itIf = (condition: boolean, ...args: Parameters<typeof test>) =>
        condition ? it(...args) : it.skip(...args);

    //1 neuplnna stranka (o 2 polozky mene, nez maximum polozek na stranku), je-li itemsPerPage < 3, test bude preskocen
    itIf(itemsPerPage > 2, '/getAstromen (1 neuplnna stranka)', async () => {
        const conn = ctx.db.getConn();
        const itemsCount = itemsPerPage - 2;
        await prepareData(itemsCount, ctx.app);
        const resp = await makeRequest(null, null, ctx.app);

        expect(resp.pagesCount).toEqual(1);
        expect(resp.page).toEqual(1);
        expect(resp.itemsCount).toEqual(itemsCount);
        expect(resp.itemsInPage).toHaveLength(itemsCount);
        await checkRecordsId(1, itemsPerPage, resp.itemsInPage, conn);
        await checkRecordsData(resp.itemsInPage, conn);
    });

    //1 uplna stranka a 1 neuplna stranka, itemsPerPage nastaven na 20
    it('/getAstromen (2 stranky)', async () => {
        const conn = ctx.db.getConn();
        const itemsPerPage = 20;
        const itemsCount = 38;
        await prepareData(itemsCount, ctx.app);

        //kontrola dat z prvni stranky
        const respPage_1 = await makeRequest(1, itemsPerPage, ctx.app);
        expect(respPage_1.pagesCount).toEqual(2);
        expect(respPage_1.page).toEqual(1);
        expect(respPage_1.itemsCount).toEqual(itemsCount);
        expect(respPage_1.itemsInPage).toHaveLength(itemsPerPage);
        await checkRecordsId(1, itemsPerPage, respPage_1.itemsInPage, conn);
        await checkRecordsData(respPage_1.itemsInPage, conn);

        //a druhe stranky
        const respPage_2 = await makeRequest(2, itemsPerPage, ctx.app);
        expect(respPage_2.pagesCount).toEqual(2);
        expect(respPage_2.page).toEqual(2);
        expect(respPage_2.itemsCount).toEqual(itemsCount);
        expect(respPage_2.itemsInPage).toHaveLength(itemsCount - itemsPerPage);
        await checkRecordsId(2, itemsPerPage, respPage_2.itemsInPage, conn);
        await checkRecordsData(respPage_2.itemsInPage, conn);
    });
});

async function prepareData(itemsCount: number, app: INestApplication) {
    const skillId_1 = await addSkill('skill_1', app);
    const skillId_2 = await addSkill('skill_2', app);
    const dobUnix = new Date('1988-08-08').getTime();

    for (let c = 1; c <= itemsCount; c++) {
        const newDob = new Date(dobUnix + c * 86400 * 1000); //kazdy cyklus pricte 1 den

        //kazdy cyklus = jina kombinace skills
        let skills: number[];
        if (c % 3 === 2) {
            skills = [skillId_1];
        } else if (c % 3 === 1) {
            skills = [skillId_2];
        } else {
            skills = [skillId_1, skillId_2];
        }

        await addAstroman(
            `fname_${c}`,
            `lname_${c}`,
            formateDateToIso(newDob),
            skills,
            app,
        );
    }
}

async function makeRequest(
    page: number | null,
    itemsPerPage: number | null,
    app: INestApplication,
): Promise<GetAstromenOutput> {
    type Query = {
        page?: number;
        itemsPerPage?: number;
    };
    const query: Query = {};
    if (page !== null) {
        query.page = page;
    }
    if (itemsPerPage !== null) {
        query.itemsPerPage = itemsPerPage;
    }

    const resp = await request(httpServerHelper(app))
        .get('/astromen')
        .query(query)
        .expect(200);
    const body = resp.body as GetAstromenOutput;

    return body;
}

// zkontroluje, zda sedi ids v DB zaznamech pro dany paginator a data z response
async function checkRecordsId(
    page: number,
    itemsPerPage: number,
    respData: AstromanRecord[],
    conn: Knex | Knex.Transaction,
) {
    const offset = (page - 1) * itemsPerPage;
    type RawDbRecord = { id: number };

    const rawDbRecords = await conn<RawDbRecord[]>('astroman')
        .select('id')
        .orderBy('id', 'asc')
        .offset(offset)
        .limit(itemsPerPage);
    const idsInDbRecords = rawDbRecords.map((item: RawDbRecord) => item.id);

    const idsInRespData = respData.map((item: AstromanRecord) => item.id);

    expect(idsInDbRecords).toEqual(expect.arrayContaining(idsInRespData));
    expect(idsInRespData).toEqual(expect.arrayContaining(idsInDbRecords));
}

// data z response srovna s daty v DB; pokud nejaka data v response chyby, tak nebudou zkontrolovana, proto dobre nejdriv provest checkRecordsId()
async function checkRecordsData(
    respData: AstromanRecord[],
    conn: Knex | Knex.Transaction,
) {
    type SkillInResponse = { id: number; name: string };

    for (const item of respData) {
        const id = item.id;
        const skills = item.skills.map(
            (skillItem: SkillInResponse) => skillItem.id,
        );
        const data: AstromanData = {
            firstName: item.firstName,
            lastName: item.lastName,
            dob: item.dob,
            skills,
        };

        await compareAstromanItemWithDb(id, data, conn);
    }
}
