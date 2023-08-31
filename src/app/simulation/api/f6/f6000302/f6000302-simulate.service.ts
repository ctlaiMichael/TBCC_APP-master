// 外匯綜活轉綜定利率查詢
import { f6000302_res_01 } from './f6000302-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class F6000302SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
      return f6000302_res_01;
  }

}
