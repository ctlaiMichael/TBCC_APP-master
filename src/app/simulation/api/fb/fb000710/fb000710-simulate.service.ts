
import { fb000710_res_01 } from './fb000710-res-01';
import { fb000710_res_02 } from './fb000710-res-01';
import { fb000710_res_03 } from './fb000710-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FB000710SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fb000710_res_02;
  }

}
