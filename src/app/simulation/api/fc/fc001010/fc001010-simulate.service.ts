
import { fc001010_res_01 } from './fc001010-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FC001010SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fc001010_res_01;
  }

}
