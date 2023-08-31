import { fh000207_res_01 } from './fh000207-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FH000207SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
      return fh000207_res_01;
  }

}
