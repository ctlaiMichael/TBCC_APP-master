import { fj000103_res_01} from './fj000103-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FJ000103SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if (reqObj.custId != "") {
      return fj000103_res_01;
    }
  }
}
