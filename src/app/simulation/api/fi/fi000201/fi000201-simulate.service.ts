/**
 * [模擬]已實現損益總覽
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000201_res_01 } from './fi000201-res-01';

export class FI000201SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000201_res_01;
  }

}
