
import { SimulationApi } from '@api-simulation/simulation-api';
import { fb000503_res_01 } from './fb000503-res-01';

export class FB000503SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return fb000503_res_01;
  }

}
