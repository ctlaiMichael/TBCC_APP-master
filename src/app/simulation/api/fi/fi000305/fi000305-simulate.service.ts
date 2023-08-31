/**
 * [模擬]基金庫存明細查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000305_res_01 } from './fi000305-res-01';

export class FI000305SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000305_res_01;
  }

}
