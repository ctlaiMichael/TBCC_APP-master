import { f4000103_res_01 } from './f4000103-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class F4000103SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
      return f4000103_res_01;
  }

}
