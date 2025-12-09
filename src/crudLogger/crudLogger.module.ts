import { Module } from '@nestjs/common';
import CrudLoggerService from './crudLogger.service';
import CrudLoggerTable from './crudLogger.table';
import DbModule from '../db/db.module';

@Module({
    imports: [DbModule],
    providers: [CrudLoggerService, CrudLoggerTable],
    exports: [CrudLoggerService],
})
export default class CrudLoggerModule {}
