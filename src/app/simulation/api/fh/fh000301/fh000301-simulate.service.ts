import { fh000301_res_01 } from './fh000301-res-01';
import { fh000301_res_02 } from './fh000301-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FH000301SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if (reqObj.hasOwnProperty('type') && reqObj['type'] == "1") {
      return fh000301_res_01;
    } else {
      return fh000301_res_02;
    }

  }

}
