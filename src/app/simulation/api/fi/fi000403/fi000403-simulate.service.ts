/**
 * [模擬]基金單筆申購申請
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000403_res_01 } from './fi000403-res-01';

export class FI000403SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000403_res_01;

  }
}
