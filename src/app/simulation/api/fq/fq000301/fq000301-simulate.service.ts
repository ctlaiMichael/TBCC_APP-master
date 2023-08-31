import { fq000301_res_01} from './fq000301-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FQ000301SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fq000301_res_01;
  }
}
