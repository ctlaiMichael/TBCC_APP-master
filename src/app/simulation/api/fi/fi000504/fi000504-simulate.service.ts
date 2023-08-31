/**
 * [模擬]基金贖回確認
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000504_res_01 } from './fi000504-res-01';

export class FI000504SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000504_res_01;

  }
}
