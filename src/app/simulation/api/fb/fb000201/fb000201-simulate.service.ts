
import { fb000201_res_01 } from './fb000201-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FB000201SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return fb000201_res_01;
  }

}
