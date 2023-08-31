/**
 * [模擬]變更現金收益存入帳號
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000602_res_01 } from './fi000602-res-01';

export class FI000602SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000602_res_01;
  }

}
