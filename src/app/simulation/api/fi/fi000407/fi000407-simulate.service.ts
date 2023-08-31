/**
 * [模擬]基金小額申購申請
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000407_res_01 } from './fi000407-res-01';

export class FI000407SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000407_res_01;

  }
}
