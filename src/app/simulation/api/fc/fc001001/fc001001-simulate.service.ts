
import { fc001001_res_01 } from './fc001001-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FC001001SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fc001001_res_01;
  }

}
