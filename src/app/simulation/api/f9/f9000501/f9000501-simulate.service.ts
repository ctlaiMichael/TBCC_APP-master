import { SimulationApi } from '@api-simulation/simulation-api';
import { f9000501_res_01 } from './f9000501-res-01';
import { f9000501_res_02 } from './f9000501-res-02';

export class F9000501SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {

    return f9000501_res_01;
    // return f9000501_res_02;
  }

}
