import { fo000103_res_01 } from './fo000103-res-01';
import { fo000103_res_02 } from './fo000103-res-02';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FO000103SimulateService implements SimulationApi{

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if (reqObj.type == '0') {
      return fo000103_res_01;
    } else {
      return fo000103_res_02;
    }
  }
}
