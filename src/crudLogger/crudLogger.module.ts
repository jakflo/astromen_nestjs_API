import { Module } from '@nestjs/common';
import CrudLoggerService from './crudLogger.service';
import CrudLoggerTable from './crudLogger.table';
import DbModule from '../db/db.module';
import CrudLoggerObserver from './crudLogger.observer';

@Module({
    imports: [DbModule],
    providers: [CrudLoggerService, CrudLoggerTable, CrudLoggerObserver],
})
export default class CrudLoggerModule {}
