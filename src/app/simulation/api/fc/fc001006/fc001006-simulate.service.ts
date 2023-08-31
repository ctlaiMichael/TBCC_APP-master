
import { fc001006_res_01 } from './fc001006-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FC001006SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fc001006_res_01;
  }

}
