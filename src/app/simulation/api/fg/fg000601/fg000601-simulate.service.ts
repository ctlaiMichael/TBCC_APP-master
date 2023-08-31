
import { fg000601_res_01 } from './fg000601-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FG000601SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fg000601_res_01;
  }

}
