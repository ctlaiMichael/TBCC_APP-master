
import { fg000405_res_01 } from './fg000405-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FG000405SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  /**
   * 網路連線密碼變更
   */
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    if (reqObj != '') {
      return fg000405_res_01;
    } 
  }
}
