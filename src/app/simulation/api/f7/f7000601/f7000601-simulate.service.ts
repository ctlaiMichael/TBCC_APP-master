import { SimulationApi } from '@api-simulation/simulation-api';
import { f7000601_res_01 } from './f7000601-res-01';

export class F7000601SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return f7000601_res_01;
  }

}
