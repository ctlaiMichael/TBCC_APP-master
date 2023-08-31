import { fj000102_res_01 ,fj000102_res_02} from './fj000102-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FJ000102SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if (reqObj.custId != "") {
      return fj000102_res_01;
    } else {
      return fj000102_res_02;
    }
  }
}
