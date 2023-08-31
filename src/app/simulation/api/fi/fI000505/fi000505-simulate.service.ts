/**
 * [模擬]基金贖回申請(預約)
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000505_res_01 } from './fi000505-res-01';

export class FI000505SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000505_res_01;
  }
}
