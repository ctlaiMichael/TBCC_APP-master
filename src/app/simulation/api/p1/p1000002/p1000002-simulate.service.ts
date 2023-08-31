import { SimulationApi } from '@api-simulation/simulation-api';
import { logger } from '@shared/util/log-util';
import { p1000002_res_01 } from './p1000002-res-01';
import { p1000002_res_02 } from './p1000002-res-02';

// tslint:disable-next-line: class-name
export class P1000002SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    logger.log(`P1000002 reqObj = ${JSON.stringify(reqObj)}`);
    switch (reqObj['editType']) {
      case 'qry':
        return p1000002_res_01;
      default:
        return p1000002_res_02;
    }
  }
}