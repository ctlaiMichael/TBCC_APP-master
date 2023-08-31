import { f103_0_res_01 } from './bi000103-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class BI000103SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return f103_0_res_01;
  }
}
