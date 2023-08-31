
/**
 * [模擬]台幣帳戶查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { f9000505_res_01 } from './f9000505-res-01';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';

export class F9000505SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return ObjectUtil.clone(f9000505_res_01);
  }

}
