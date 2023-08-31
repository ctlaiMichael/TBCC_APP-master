import { fq000109_res_01} from './fq000109-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FQ000109SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fq000109_res_01;
  }
}
