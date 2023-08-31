/**
 * [模擬]台幣綜存彙總
 */
import { f2100106_res_01 } from './f2100106-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class F2100106SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
      return f2100106_res_01;
  }

}
