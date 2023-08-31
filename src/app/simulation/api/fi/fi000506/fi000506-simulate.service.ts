/**
 * [模擬]基金贖回確認(預約)
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000506_res_01 } from './fi000506-res-01';

export class FI000506SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000506_res_01;

  }
}
