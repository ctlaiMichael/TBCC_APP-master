/**
 * [模擬]基金單筆申購確認
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000408_res_01 } from './fi000408-res-01';

export class FI000408SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000408_res_01;

  }
}
