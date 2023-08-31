
//繳交外幣保費
import { f5000202_res_01 } from './f5000202-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util'

export class F5000202SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return ObjectUtil.clone(f5000202_res_01);
  }

}
