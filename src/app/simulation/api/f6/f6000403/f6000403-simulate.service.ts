/**
 * [模擬]外幣綜定存中途解約
 */
import { f6000403_res_01 } from './f6000403-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util'


export class F6000403SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return ObjectUtil.clone(f6000403_res_01);
  }

}
