import { fn000102_res_01 } from './fn000102-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FN000102SimulateService implements SimulationApi{

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fn000102_res_01;
  }
}
