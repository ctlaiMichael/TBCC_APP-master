import { f6000201_res_01 } from './f6000201-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class F6000201SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
      return f6000201_res_01;
  }

}
