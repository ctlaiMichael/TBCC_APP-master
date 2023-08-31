
import { fb000106_res_01 } from './fb000106-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FB000106SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return fb000106_res_01;
  }

}