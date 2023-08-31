/**
 * [模擬]基金轉換申請(預約)
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000509_res_01 } from './fi000509-res-01';

export class FI000509SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000509_res_01;

  }
}
