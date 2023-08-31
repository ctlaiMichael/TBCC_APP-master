/**
 * [模擬]基金轉換確認
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000510_res_01 } from './fi000510-res-01';

export class FI000510SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000510_res_01;

  }
}
