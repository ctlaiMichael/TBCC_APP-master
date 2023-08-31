
import { fg000403_res_01 } from './fg000403-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FG000403SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  /**
   * 常用帳號查詢
   */
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    if (reqObj.custId != '') {
      return fg000403_res_01;
    }
  }
}
