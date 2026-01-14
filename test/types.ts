import { INestApplication } from '@nestjs/common';
import DbService from '../src/db/db.service';

//vsechny jinak povinne polozky jsou nepovinne, takze je mozne udelat neplatny request
type AddOrEditAstromanDataSoft = {
    firstName?: string;
    lastName?: string;
    dob?: string;
    skills?: number[];
};

interface TestContext {
  app: INestApplication;
  db: DbService;
}

export type { AddOrEditAstromanDataSoft, TestContext };
