
import { f9000403_res_01, f9000403_res_02 } from './f9000403-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util'

export class F9000403SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if(reqObj['txKind']=='A') {
      return ObjectUtil.clone(f9000403_res_01);
    } else {
      return ObjectUtil.clone(f9000403_res_02);
    }
    
  }

}
