import { Module } from '@nestjs/common';
import GetAstromenController from './getAstromen.controller';
import GetAstromenService from './getAstromen.service';
import DbModule from '../db/db.module';

@Module({
  imports: [DbModule],
    controllers: [GetAstromenController],
    providers: [GetAstromenService],
})
export default class GetAstromenModule {}
