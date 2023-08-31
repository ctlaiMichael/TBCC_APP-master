
import { fg000401_res_01 } from './fg000401-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FG000401SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  /**
   * 網路連線密碼變更
   */
  public getResponse(reqObj) {
    return fg000401_res_01;
  }
}
