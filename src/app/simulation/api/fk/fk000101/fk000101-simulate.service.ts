
import { fk000101_res_01 } from './fk000101-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FK000101SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  /**
   * 通訊地址查詢
   */
  public getResponse(reqObj) {
    if (reqObj.custId != '') {
      return fk000101_res_01;
    } 
  }
}
