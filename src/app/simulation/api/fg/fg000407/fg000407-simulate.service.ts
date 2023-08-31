
import { fg000407_res_01, fg000407_res_02 } from './fg000407-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FG000407SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  /**
   * 網路連線密碼變更
   */
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    if (reqObj.marketingType != '') {
      return fg000407_res_01;
    } else {
      return fg000407_res_02;
    }
  }
}
