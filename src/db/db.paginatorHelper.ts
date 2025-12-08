import { Injectable } from '@nestjs/common';

type LimitAndOffsetReturn = {
    limit: number;
    offset: number;
};

@Injectable()
export default class PaginatorHelper {
    getLimitAndOffset(page: number, itemsPerPage: number): LimitAndOffsetReturn {
        const limit = itemsPerPage;
        const offset = itemsPerPage * (page - 1);
        return { limit, offset };
    }

    getPagesCount(itemsPerPage: number, itemsCount: number): number {
        return Math.ceil(itemsCount / itemsPerPage);
    }

}
