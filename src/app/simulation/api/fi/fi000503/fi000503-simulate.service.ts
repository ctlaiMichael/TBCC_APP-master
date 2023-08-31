/**
 * [模擬]基金贖回申請
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000503_res_01 } from './fi000503-res-01';

export class FI000503SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000503_res_01;

  }
}
