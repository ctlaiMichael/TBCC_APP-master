
//外幣保費資料查詢
import { f5000201_res_01, f5000201_res_02 } from './f5000201-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util'

export class F5000201SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return ObjectUtil.clone(f5000201_res_01);
  }

}
