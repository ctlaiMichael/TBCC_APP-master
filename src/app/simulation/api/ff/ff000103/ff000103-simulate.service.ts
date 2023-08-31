
import { ff000103_res_01 } from './ff000103-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FF000103SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  /**
   * EMAIL變更
   */
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    if (reqObj.custId != '') {
      return ff000103_res_01;
    } 
  }
}
