import {SimulationApi} from '@api-simulation/simulation-api';
import {fo000104_res_01} from './fo000104-res-01';

export class FO000104SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fo000104_res_01;
  }
}
