/**
 * [模擬]基金單筆預約申購確認
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000406_res_01 } from './fi000406-res-01';

export class FI000406SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000406_res_01;

  }
}
