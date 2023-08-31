import { fh000208_res_01 } from './fh000208-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FH000208SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
      return fh000208_res_01;
  }

}
