
import { fb000105_res_01 } from './fb000105-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FB000105SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return fb000105_res_01;
  }

}
