
import { fc001004_res_01 } from './fc001004-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FC001004SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fc001004_res_01;
  }

}
