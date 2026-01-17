import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import PaginatorHelper from '../db/db.paginatorHelper';
import type { RecordCountType } from '../db/db.service';
import { formateDateToIso } from '../utils/dateTools';

type AstromanDbRecord = {
    id: number;
    first_name: string;
    last_name: string;
    DOB: Date;
};

type AstromanWithSkillListDbRecord = AstromanDbRecord & {
    skill_id: number;
    skill_name: string;
};

type AstromanRecordWoSkills = {
    id: number;
    firstName: string;
    lastName: string;
    dob: string;
};

type AstromanRecord = AstromanRecordWoSkills & {
    skills: Array<{
        id: number;
        name: string;
    }>;
};

type GetAstromenOutput = {
    itemsCount: number;
    pagesCount: number;
    page: number;
    itemsInPage: AstromanRecord[]
};

@Injectable()
export default class GetAstromenService {
    constructor(
        private readonly db: DbService,
        private readonly paginatorHelper: PaginatorHelper,
    ) {}

    async getAstromen(page: number, itemsPerPage: number): Promise<GetAstromenOutput> {
        const conn = this.db.getConn();

        const { limit, offset } = this.paginatorHelper.getLimitAndOffset(
            page,
            itemsPerPage,
        );
        const itemsCount = (
            await conn('astroman')
                .count<RecordCountType>({ count: '*' })
                .first()
        ).count;
        const pagesCount = this.paginatorHelper.getPagesCount(
            itemsPerPage,
            itemsCount,
        );

        if (itemsCount === 0) {
            return { itemsCount, pagesCount, page, itemsInPage: [] as AstromanRecord[] };
        }

        const idsInPage = (
            await conn('astroman')
                .select('id')
                .limit(limit)
                .offset(offset)
                .orderBy('id')
        ).map((item: AstromanDbRecord) => {
            return item.id;
        });

        const [resultRaw] = (await conn.raw(
            `SELECT a.*, s.id AS skill_id, s.name as skill_name 
            FROM astroman a 
            JOIN astroman_has_skill ahs ON a.id = ahs.astroman_id 
            JOIN skill s ON ahs.skill_id = s.id 
            WHERE a.id IN(?) 
            ORDER BY a.id`,
            [idsInPage],
        )) as Array<Array<AstromanWithSkillListDbRecord>>;

        const itemsInPage = this.getItemsFromRawRecords(resultRaw);
        return { itemsCount, pagesCount, page, itemsInPage };
    }

    private getItemsFromRawRecords(
        rawRecords: AstromanWithSkillListDbRecord[],
    ): AstromanRecord[] {
        const recordIdsWithDoops = rawRecords.map(
            (record: AstromanWithSkillListDbRecord) => {
                return record.id;
            },
        );
        const recordIds = [...new Set(recordIdsWithDoops)];
        const output: AstromanRecord[] = [];

        for (const id of recordIds) {
            const recordsWithId = rawRecords.filter(
                (record: AstromanWithSkillListDbRecord) => {
                    return record.id === id;
                },
            );

            const recordWoSkillsRaw = recordsWithId[0];
            const recordWoSkills: AstromanRecordWoSkills = {
                id: recordWoSkillsRaw.id,
                firstName: recordWoSkillsRaw.first_name,
                lastName: recordWoSkillsRaw.last_name,
                dob: formateDateToIso(recordWoSkillsRaw.DOB),
            };

            const skillForRecord = recordsWithId.map(
                (record: AstromanWithSkillListDbRecord) => {
                    return {
                        id: record.skill_id,
                        name: record.skill_name,
                    };
                },
            );

            output.push({
                ...recordWoSkills,
                skills: skillForRecord,
            });
        }

        return output;
    }
}

export type { AstromanDbRecord, AstromanRecord, GetAstromenOutput };
