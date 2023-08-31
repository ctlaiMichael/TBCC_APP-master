import { p1000001_res_01 } from './p1000001-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

// tslint:disable-next-line: class-name
export class P1000001SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return p1000001_res_01;
  }
}