
import { fb000711_res_01 } from './fb000711-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FB000711SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fb000711_res_01;
  }

}
