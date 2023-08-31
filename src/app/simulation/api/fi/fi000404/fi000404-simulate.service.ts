/**
 * [模擬]基金單筆申購確認
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000404_res_01 } from './fi000404-res-01';

export class FI000404SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000404_res_01;

  }
}
