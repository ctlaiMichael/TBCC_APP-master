/**
 * [模擬]基金小額申購確認-新基金主機板本
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000710_res_01 } from './fi000710-res-01';

export class FI000710SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000710_res_01;
  }

}
