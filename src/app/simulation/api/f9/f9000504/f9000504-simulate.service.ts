
import { f9000504_res_01 } from './f9000504-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util'

export class F9000504SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return ObjectUtil.clone(f9000504_res_01);
  }

}