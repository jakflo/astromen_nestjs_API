import { INestApplication } from '@nestjs/common';
import DbService from '../src/db/db.service';
import AstromanItemDto from '../src/addOrEditAstromanCommon/dto/AstromanItemDto';

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

type AstromanData = InstanceType<typeof AstromanItemDto>;

export type { AddOrEditAstromanDataSoft, TestContext, AstromanData };
