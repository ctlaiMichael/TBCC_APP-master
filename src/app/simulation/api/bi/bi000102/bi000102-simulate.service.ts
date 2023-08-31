import { f100_0_res_01 } from './bi000102-res-01';
import { f100_0_res_02 } from './bi000102-res-02';
import { f100_0_res_03 } from './bi000102-res-03';
import { SimulationApi } from '@api-simulation/simulation-api';

export class BI000102SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return f100_0_res_01;
  }
}