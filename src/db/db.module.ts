import { Module } from '@nestjs/common';
import DbService from './db.service';
import PaginatorHelper from './db.paginatorHelper';

@Module({
    providers: [DbService, PaginatorHelper],
    exports: [DbService, PaginatorHelper],
})
export default class DbModule {}
