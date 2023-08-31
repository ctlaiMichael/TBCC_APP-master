
//外幣活存預約轉帳查詢
import { f5000106_res_01 } from './f5000106-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util'

export class F5000106SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return ObjectUtil.clone(f5000106_res_01);
  }

}
