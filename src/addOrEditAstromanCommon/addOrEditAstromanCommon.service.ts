import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import type { RecordCountType } from '../db/db.service';

@Injectable()
export default class AddOrEditAstromanCommonService {
    constructor(private readonly db: DbService) {}

    async astromanExists(
        firstName: string,
        lastName: string,
        dob: string,
        exceptId: number | null = null, // s vyjimkou astronauta s timto id (napr. id editovane polozky)
    ): Promise<boolean> {
        const itemsCount = (
            await this.db
                .knex('astroman')
                .count({ count: '*' })
                .where('first_name', firstName)
                .andWhere('last_name', lastName)
                .andWhere('DOB', dob)
                .modify((builder) => {
                    if (exceptId !== null) {
                        builder.whereNot('id', exceptId);
                    }
                })
                .first<RecordCountType>()
        ).count;

        return itemsCount > 0;
    }
}
