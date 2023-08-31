import { fj000101_res_01 ,fj000101_res_02} from './fj000101-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FJ000101SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if (reqObj.custId != "") {
      return fj000101_res_01;
    } else {
      return fj000101_res_02;
    }
  }
}
